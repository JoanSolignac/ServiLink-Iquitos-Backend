import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { UserRole } from '@prisma/client';
import { CreateServiceBodyDto } from './dtos/request/create-service.request.dto';
import { UpdateServiceRequestDto } from './dtos/request/update-service.request.dto';
import { ListPublicServicesQueryDto } from './dtos/request/list-public-services.query.dto';
import { ListMyServicesQueryDto } from './dtos/request/list-my-services.query.dto';
import { CreateServiceFeature } from './features/create-service.feature';
import { UpdateServiceFeature } from './features/update-service.feature';
import { ApproveServiceFeature } from './features/approve-service.feature';
import { RejectServiceFeature } from './features/reject-service.feature';
import { FindServiceByIdFeature } from './features/find-service-by-id.feature';
import { ListPublicServicesFeature } from './features/list-public-services.feature';
import { ListMyServicesFeature } from './features/list-my-services.feature';
import { ListAdminServicesFeature } from './features/list-admin-services.feature';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';
import {
  ServiceWithProfileResponseDto,
  ServiceDetailResponseDto,
  ServiceRatingResponseDto,
} from './dtos/response/service-with-profile.response.dto';
import { ServiceWithProfilePaginatedResponseDto } from './dtos/response/service-with-profile-paginated.response.dto';
import {
  ServiceWithProfile,
  ServiceDetail,
} from './types/service-with-profile.type';
import { MyService } from '@modules/services/types/my-service.type';
import { MyServiceResponseDto } from '@modules/services/dtos/response/my-service.response.dto';
import { MyServicePaginatedResponseDto } from '@modules/services/dtos/response/my-service-paginated.response.dto';
import {
  ServiceImagesValidationPipe,
  ValidatedImageFile,
} from '@common/pipes/service-images-validation.pipe';
import { SupabaseStorageService } from '@supabase/services/supabase-storage.service';

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg';
  const date = new Date().toISOString().split('T')[0];
  const id = crypto.randomUUID();
  return `${date}-${id}.${ext}`;
}

function toResponseServiceWithProfile(
  service: ServiceWithProfile,
): ServiceWithProfileResponseDto {
  return {
    serviceId: service.id,
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    imageUrls: service.imageUrls,
    price: service.price != null ? service.price.toNumber() : null,
    pricingUnit: service.pricingUnit ?? null,
    status: service.status,
    providerName:
      `${service.user.profile!.firstName} ${service.user.profile!.lastName}`.trim(),
    providerPictureUrl: service.user.profile?.profilePictureUrl ?? '',
    averageRating: service.averageRating,
  };
}

function toResponseServiceDetail(
  service: ServiceDetail,
): ServiceDetailResponseDto {
  const ratings: ServiceRatingResponseDto[] = service.ratings.map((r) => ({
    customerName:
      `${r.customer.profile?.firstName ?? ''} ${r.customer.profile?.lastName ?? ''}`.trim(),
    customerPictureUrl: r.customer.profile?.profilePictureUrl ?? null,
    score: r.score,
    comment: r.comment,
    createdAt: r.createdAt,
  }));

  return {
    ...toResponseServiceWithProfile(service),
    ratings,
  };
}

function toResponseMyService(myService: MyService): MyServiceResponseDto {
  return {
    serviceId: myService.id,
    title: myService.title,
    description: myService.description,
    keywords: myService.keywords,
    imageUrls: myService.imageUrls,
    price: myService.price != null ? myService.price.toNumber() : null,
    pricingUnit: myService.pricingUnit ?? null,
    status: myService.status,
  };
}

@ApiTags('Services')
@ApiBearerAuth('bearer')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly createServiceFeature: CreateServiceFeature,
    private readonly updateServiceFeature: UpdateServiceFeature,
    private readonly approveServiceFeature: ApproveServiceFeature,
    private readonly rejectServiceFeature: RejectServiceFeature,
    private readonly findServiceByIdFeature: FindServiceByIdFeature,
    private readonly listPublicServicesFeature: ListPublicServicesFeature,
    private readonly listMyServicesFeature: ListMyServicesFeature,
    private readonly listAdminServicesFeature: ListAdminServicesFeature,
    private readonly supabaseStorage: SupabaseStorageService,
  ) {}

  @Post()
  @UseAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceBodyDto })
  @ApiResponse({
    status: 201,
    description:
      'Service created successfully. Status defaults to REQUIRE_REVIEW.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Body() dto: CreateServiceBodyDto,
    @UploadedFiles(ServiceImagesValidationPipe)
    imageFiles: ValidatedImageFile[],
  ): Promise<void> {
    const imageUrls = await Promise.all(
      imageFiles.map((f) =>
        this.supabaseStorage.upload({
          file: f.buffer,
          fileName: generateFileName(f.originalname),
          contentType: f.mimetype,
          folder: 'services',
        }),
      ),
    );

    await this.createServiceFeature.execute(
      authCurrentUser.id,
      dto.title,
      dto.description,
      dto.price,
      dto.keywords ?? [],
      dto.pricingUnit,
      imageUrls,
    );
  }

  @Patch(':id')
  @UseAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateServiceRequestDto })
  @ApiResponse({
    status: 204,
    description:
      'Service updated successfully. Status resets to REQUIRE_REVIEW.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
    @UploadedFiles(ServiceImagesValidationPipe)
    imageFiles: ValidatedImageFile[],
  ): Promise<void> {
    const newImageUrls =
      imageFiles.length > 0
        ? await Promise.all(
            imageFiles.map((f) =>
              this.supabaseStorage.upload({
                file: f.buffer,
                fileName: generateFileName(f.originalname),
                contentType: f.mimetype,
                folder: 'services',
              }),
            ),
          )
        : undefined;

    const { urlsToDelete } = await this.updateServiceFeature.execute({
      serviceId: id,
      requestingUserId: authCurrentUser.id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      pricingUnit: dto.pricingUnit,
      keywords: dto.keywords,
      keepImageUrls: dto.keepImageUrls,
      newImageUrls,
    });

    if (urlsToDelete.length > 0) {
      await Promise.allSettled(
        urlsToDelete.map((url) => this.supabaseStorage.delete(url)),
      );
    }
  }

  @Get()
  @UseAuth()
  @ApiOperation({ summary: 'Get public catalog of approved services' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of approved services',
    type: ServiceWithProfilePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listPublic(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Query() query: ListPublicServicesQueryDto,
  ): Promise<ServiceWithProfilePaginatedResponseDto> {
    const result = await this.listPublicServicesFeature.execute({
      currentUserId: authCurrentUser.id,
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: result.servicesUserProfile.map(toResponseServiceWithProfile),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total: result.total,
      },
    };
  }

  @Get('me')
  @UseAuth()
  @ApiOperation({ summary: 'Get current user services' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of services owned by the current user',
    type: MyServicePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listMy(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Query() query: ListMyServicesQueryDto,
  ): Promise<MyServicePaginatedResponseDto> {
    const result = await this.listMyServicesFeature.execute({
      userId: authCurrentUser.id,
      search: query.search,
      status: query.status,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: result.myServices.map(toResponseMyService),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total: result.total,
      },
    };
  }

  @Get('admin')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @ApiOperation({
    summary: 'Get services pending review (admin/moderator only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of services with status REQUIRE_REVIEW',
    type: ServiceWithProfilePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  async listAdmin(
    @Query() query: PaginateQueryDto,
  ): Promise<ServiceWithProfilePaginatedResponseDto> {
    const result = await this.listAdminServicesFeature.execute({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: result.servicesUserProfile.map(toResponseServiceWithProfile),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total: result.total,
      },
    };
  }

  @Get(':id')
  @UseAuth()
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Service found',
    type: ServiceDetailResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found or not visible' })
  async findById(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ServiceDetailResponseDto> {
    const service = await this.findServiceByIdFeature.execute({
      serviceId: id,
      requestingUserId: authCurrentUser.id,
      requestingUserRole: authCurrentUser.role,
    });

    return toResponseServiceDetail(service);
  }

  @Patch(':id/approve')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Approve a service (moderator/admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 204,
    description: 'Service approved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 409, description: 'Service already approved' })
  async approve(@Param('id') id: string): Promise<void> {
    await this.approveServiceFeature.execute(id);
  }

  @Patch(':id/reject')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reject a service (moderator/admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 204,
    description: 'Service rejected successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async reject(@Param('id') id: string): Promise<void> {
    await this.rejectServiceFeature.execute(id);
  }
}
