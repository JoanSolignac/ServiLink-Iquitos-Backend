import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { UserRole } from '@prisma/client';
import { CreateServiceRequestDto } from './dtos/request/create-service.request.dto';
import { UpdateServiceRequestDto } from './dtos/request/update-service.request.dto';
import { ListPublicServicesQueryDto } from './dtos/request/list-public-services.query.dto';
import { ListMyServicesQueryDto } from './dtos/request/list-my-services.query.dto';
import { ServiceResponseDto } from './dtos/response/service.response.dto';
import { ServicePaginatedResponseDto } from './dtos/response/service-paginated.response.dto';
import { CreateServiceFeature } from './features/create-service.feature';
import { UpdateServiceFeature } from './features/update-service.feature';
import { ApproveServiceFeature } from './features/approve-service.feature';
import { RejectServiceFeature } from './features/reject-service.feature';
import { FindServiceByIdFeature } from './features/find-service-by-id.feature';
import { ListPublicServicesFeature } from './features/list-public-services.feature';
import { ListMyServicesFeature } from './features/list-my-services.feature';
import { ListAdminServicesFeature } from './features/list-admin-services.feature';
import { Service } from '@prisma/client';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';

function toResponseService(service: Service): ServiceResponseDto {
  return {
    id: service.id,
    userId: service.userId,
    title: service.title,
    description: service.description,
    price: (service.price as unknown as number) ?? service.price,
    status: service.status,
    keywords: service.keywords,
    createdAt:
      service.createdAt instanceof Date
        ? service.createdAt.toISOString()
        : String(service.createdAt),
    updatedAt:
      service.updatedAt instanceof Date
        ? service.updatedAt.toISOString()
        : String(service.updatedAt),
  };
}

function toResponseServiceList(services: Service[]): ServiceResponseDto[] {
  return services.map(toResponseService);
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
  ) {}

  @Post()
  @UseAuth()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceRequestDto })
  @ApiResponse({
    status: 201,
    description:
      'Service created successfully. Status defaults to REQUIRE_REVIEW.',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Body() dto: CreateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceFeature.execute(
      authCurrentUser.id,
      dto.title,
      dto.description,
      dto.price,
      dto.keywords ?? [],
    );

    return toResponseService(service);
  }

  @Patch(':id')
  @UseAuth()
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateServiceRequestDto })
  @ApiResponse({
    status: 200,
    description:
      'Service updated successfully. Status resets to REQUIRE_REVIEW.',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceFeature.execute({
      serviceId: id,
      requestingUserId: authCurrentUser.id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      keywords: dto.keywords,
    });

    return toResponseService(service);
  }

  @Get()
  @UseAuth()
  @ApiOperation({ summary: 'Get public catalog of approved services' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of approved services',
    type: ServicePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listPublic(
    @Query() query: ListPublicServicesQueryDto,
  ): Promise<ServicePaginatedResponseDto> {
    const result = await this.listPublicServicesFeature.execute({
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: toResponseServiceList(result.services),
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
    type: ServicePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listMy(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Query() query: ListMyServicesQueryDto,
  ): Promise<ServicePaginatedResponseDto> {
    const result = await this.listMyServicesFeature.execute({
      userId: authCurrentUser.id,
      search: query.search,
      status: query.status,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: toResponseServiceList(result.services),
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
    type: ServicePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  async listAdmin(
    @Query() query: PaginateQueryDto,
  ): Promise<ServicePaginatedResponseDto> {
    const result = await this.listAdminServicesFeature.execute({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return {
      data: toResponseServiceList(result.services),
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
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found or not visible' })
  async findById(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ServiceResponseDto> {
    const service = await this.findServiceByIdFeature.execute({
      serviceId: id,
      requestingUserId: authCurrentUser.id,
      requestingUserRole: authCurrentUser.role,
    });

    return toResponseService(service);
  }

  @Patch(':id/approve')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Approve a service (moderator/admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Service approved successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 409, description: 'Service already approved' })
  async approve(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.approveServiceFeature.execute(id);
    return toResponseService(service);
  }

  @Patch(':id/reject')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Reject a service (moderator/admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Service rejected successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires MODERATOR or ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async reject(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.rejectServiceFeature.execute(id);
    return toResponseService(service);
  }
}
