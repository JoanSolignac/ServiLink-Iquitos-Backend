import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/infrastructure/security/decorators/current-user.decorator';
import type { AuthCurrentUser } from '../../../auth/domain/interfaces/auth-current-user.interface';
import { UseAuth } from '../../../auth/infrastructure/security/decorators/use-auth.decorator';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { CreateServiceRequestDto } from '../dto/request/create-service.request.dto';
import { UpdateServiceRequestDto } from '../dto/request/update-service.request.dto';
import { ListPublicServicesQueryDto } from '../dto/request/list-public-services.query.dto';
import { ListMyServicesQueryDto } from '../dto/request/list-my-services.query.dto';
import { ListAdminServicesQueryDto } from '../dto/request/list-admin-services.query.dto';
import { ServiceResponseDto } from '../dto/response/service.response.dto';
import { PaginatedResponseDto } from '../../../../shared/infrastructure/dto/paginated-response.dto';
import {
  toResponseService,
  toResponseServiceList,
} from '../presenters/service.presenter';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case';
import { ApproveServiceUseCase } from '../../application/use-cases/approve-service.use-case';
import { RejectServiceUseCase } from '../../application/use-cases/reject-service.use-case';
import { ListPublicServicesUseCase } from '../../application/use-cases/list-public-services.use-case';
import { ListMyServicesUseCase } from '../../application/use-cases/list-my-services.use-case';
import { ListAdminServicesUseCase } from '../../application/use-cases/list-admin-services.use-case';
import { FindServiceByIdUseCase } from '../../application/use-cases/find-service-by-id.use-case';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly approveServiceUseCase: ApproveServiceUseCase,
    private readonly rejectServiceUseCase: RejectServiceUseCase,
    private readonly listPublicServicesUseCase: ListPublicServicesUseCase,
    private readonly listMyServicesUseCase: ListMyServicesUseCase,
    private readonly listAdminServicesUseCase: ListAdminServicesUseCase,
    private readonly findServiceByIdUseCase: FindServiceByIdUseCase,
  ) {}

  @Post()
  @UseAuth()
  async create(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Body() dto: CreateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute({
      userId: authCurrentUser.id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      keywords: dto.keywords ?? [],
    });

    return toResponseService(service);
  }

  @Patch(':id')
  @UseAuth()
  async update(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute({
      serviceId: ServiceId.from(id),
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
  async listPublic(
    @Query() query: ListPublicServicesQueryDto,
  ): Promise<PaginatedResponseDto<ServiceResponseDto>> {
    const pagination = Pagination.create(query.page, query.limit);

    const result = await this.listPublicServicesUseCase.execute({
      search: query.search,
      keywords: query.keywords,
      pagination,
    });

    const data = toResponseServiceList(result.services);

    return {
      data,
      meta: {
        page: pagination.getPage(),
        limit: pagination.getLimit(),
        total: result.total,
      },
    };
  }

  @Get('me')
  @UseAuth()
  async listMy(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Query() query: ListMyServicesQueryDto,
  ): Promise<PaginatedResponseDto<ServiceResponseDto>> {
    const pagination = Pagination.create(query.page, query.limit);

    const result = await this.listMyServicesUseCase.execute({
      search: query.search,
      keywords: query.keywords,
      status: query.status,
      pagination,
      requestingUserId: authCurrentUser.id,
    });

    const data = toResponseServiceList(result.services);

    return {
      data,
      meta: {
        page: pagination.getPage(),
        limit: pagination.getLimit(),
        total: result.total,
      },
    };
  }

  @Get('admin')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  async listAdmin(
    @Query() query: ListAdminServicesQueryDto,
  ): Promise<PaginatedResponseDto<ServiceResponseDto>> {
    const pagination = Pagination.create(query.page, query.limit);

    const result = await this.listAdminServicesUseCase.execute({
      search: query.search,
      keywords: query.keywords,
      userId: query.userId,
      status: query.status,
      pagination,
    });

    const data = toResponseServiceList(result.services);

    return {
      data,
      meta: {
        page: pagination.getPage(),
        limit: pagination.getLimit(),
        total: result.total,
      },
    };
  }

  @Get(':id')
  @UseAuth()
  async findById(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ServiceResponseDto> {
    const service = await this.findServiceByIdUseCase.execute({
      serviceId: ServiceId.from(id),
      requestingUserId: authCurrentUser.id,
      requestingUserRole: authCurrentUser.role,
    });

    return toResponseService(service);
  }

  @Patch(':id/approve')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  async approve(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.approveServiceUseCase.execute(
      ServiceId.from(id),
    );
    return toResponseService(service);
  }

  @Patch(':id/reject')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  async reject(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.rejectServiceUseCase.execute(ServiceId.from(id));
    return toResponseService(service);
  }
}
