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
import { ListServiceRequestsQueryDto } from './dtos/request/list-service-requests.query.dto';
import { CreateServiceRequestBodyDto } from './dtos/request/create-service-request.request.dto';
import { ReceivedServiceRequestResponseDto } from './dtos/response/received-service-request.response.dto';
import { SentServiceRequestResponseDto } from './dtos/response/sent-service-request.response.dto';
import { SentServiceRequestPaginatedResponseDto } from './dtos/response/sent-service-request-paginated.response.dto';
import { ReceivedServiceRequestPaginatedResponseDto } from './dtos/response/received-service-request-paginated.response.dto';
import { ListSentRequestsFeature } from './features/list-sent-requests.feature';
import { ListReceivedRequestsFeature } from './features/list-received-requests.feature';
import { CreateServiceRequestFeature } from './features/create-service-request.feature';
import { AcceptServiceRequestFeature } from './features/accept-service-request.feature';
import { RejectServiceRequestFeature } from './features/reject-service-request.feature';
import { CancelServiceRequestFeature } from './features/cancel-service-request.feature';
import { FinishServiceRequestFeature } from './features/finish-service-request.feature';
import { ConfirmServiceRequestFeature } from './features/confirm-service-request.feature';
import { GetServiceRequestByIdFeature } from './features/get-service-request-by-id.feature';
import { ServiceRequestDetailResponseDto } from './dtos/response/service-request-detail.response.dto';
import {
  toReceivedResponse,
  toSentResponse,
  toDetailResponse,
} from '@modules/service-requests/utils/service-request-to-response.util';

@ApiTags('Service Requests')
@ApiBearerAuth('bearer')
@UseAuth()
@Controller('')
export class ServiceRequestsController {
  constructor(
    private readonly listSentRequestsFeature: ListSentRequestsFeature,
    private readonly listReceivedRequestsFeature: ListReceivedRequestsFeature,
    private readonly createServiceRequestFeature: CreateServiceRequestFeature,
    private readonly acceptServiceRequestFeature: AcceptServiceRequestFeature,
    private readonly rejectServiceRequestFeature: RejectServiceRequestFeature,
    private readonly cancelServiceRequestFeature: CancelServiceRequestFeature,
    private readonly finishServiceRequestFeature: FinishServiceRequestFeature,
    private readonly confirmServiceRequestFeature: ConfirmServiceRequestFeature,
    private readonly getServiceRequestByIdFeature: GetServiceRequestByIdFeature,
  ) {}

  @Post('services/:serviceId/requests')
  @ApiOperation({ summary: 'Create a service request' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiBody({ type: CreateServiceRequestBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Service request created',
    type: SentServiceRequestResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Service not found or not approved',
  })
  @ApiResponse({
    status: 409,
    description: 'Active request already exists for this service',
  })
  async create(
    @CurrentUser() user: AuthCurrentUser,
    @Param('serviceId') serviceId: string,
    @Body() dto: CreateServiceRequestBodyDto,
  ): Promise<SentServiceRequestResponseDto> {
    const sr = await this.createServiceRequestFeature.execute({
      customerId: user.id,
      serviceId,
      description: dto.description,
    });
    return toSentResponse(sr);
  }

  @Get('/service-requests/sent')
  @ApiOperation({
    summary: 'List my sent service requests (as customer)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of sent requests',
    type: SentServiceRequestPaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listSent(
    @CurrentUser() user: AuthCurrentUser,
    @Query() query: ListServiceRequestsQueryDto,
  ): Promise<SentServiceRequestPaginatedResponseDto> {
    const { data, total } = await this.listSentRequestsFeature.execute({
      customerId: user.id,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    return {
      data: data.map(toSentResponse),
      meta: { page: query.page ?? 1, limit: query.limit ?? 10, total },
    };
  }

  @Get('/service-requests/received')
  @ApiOperation({
    summary: 'List requests received on my services (as provider)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of received requests',
    type: ReceivedServiceRequestPaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listReceived(
    @CurrentUser() user: AuthCurrentUser,
    @Query() query: ListServiceRequestsQueryDto,
  ): Promise<ReceivedServiceRequestPaginatedResponseDto> {
    const { data, total } = await this.listReceivedRequestsFeature.execute({
      actorId: user.id,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    return {
      data: data.map(toReceivedResponse),
      meta: { page: query.page ?? 1, limit: query.limit ?? 10, total },
    };
  }

  @Get('service-requests/:id')
  @ApiOperation({
    summary: 'Get a service request by ID (customer or provider perspective)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Service request detail',
    type: ServiceRequestDetailResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not part of this request' })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  async findById(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ServiceRequestDetailResponseDto> {
    const sr = await this.getServiceRequestByIdFeature.execute(id, user.id);
    return toDetailResponse(sr, user.id);
  }

  @Patch('service-requests/:id/accept')
  @ApiOperation({
    summary: 'Accept a service request (provider only, from PENDING)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Request accepted',
    type: ReceivedServiceRequestResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized — not the provider' })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async accept(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ReceivedServiceRequestResponseDto> {
    const sr = await this.acceptServiceRequestFeature.execute(id, user.id);
    return toReceivedResponse(sr);
  }

  @Patch('service-requests/:id/reject')
  @ApiOperation({
    summary:
      'Reject a service request. Provider rejects from PENDING; customer rejects from FINISHED.',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Request rejected',
    type: ReceivedServiceRequestResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized — wrong actor for current status',
  })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async reject(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ReceivedServiceRequestResponseDto> {
    const sr = await this.rejectServiceRequestFeature.execute(id, user.id);
    return toReceivedResponse(sr);
  }

  @Patch('service-requests/:id/cancel')
  @ApiOperation({
    summary: 'Cancel a service request (customer or provider, from ACCEPTED)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Request cancelled',
    type: SentServiceRequestResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized — not the customer nor the provider',
  })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async cancel(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<SentServiceRequestResponseDto> {
    const sr = await this.cancelServiceRequestFeature.execute(id, user.id);
    return toSentResponse(sr);
  }

  @Patch('service-requests/:id/finish')
  @ApiOperation({
    summary:
      'Mark a service request as finished (provider only, from ACCEPTED)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Request marked as finished',
    type: ReceivedServiceRequestResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized — not the provider' })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async finish(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<ReceivedServiceRequestResponseDto> {
    const sr = await this.finishServiceRequestFeature.execute(id, user.id);
    return toReceivedResponse(sr);
  }

  @Patch('service-requests/:id/confirm')
  @ApiOperation({
    summary: 'Confirm service completion (customer only, from FINISHED)',
  })
  @ApiParam({ name: 'id', description: 'Service request ID' })
  @ApiResponse({
    status: 200,
    description: 'Request confirmed',
    type: SentServiceRequestResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized — not the customer' })
  @ApiResponse({ status: 404, description: 'Service request not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async confirm(
    @CurrentUser() user: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<SentServiceRequestResponseDto> {
    const sr = await this.confirmServiceRequestFeature.execute(id, user.id);
    return toSentResponse(sr);
  }
}
