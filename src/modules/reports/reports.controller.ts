import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';
import { CheckMyServiceReportFeature } from './features/check-my-service-report.feature';
import { CheckMyUserReportFeature } from './features/check-my-user-report.feature';
import { CreateServiceReportFeature } from './features/create-service-report.feature';
import { CreateUserReportFeature } from './features/create-user-report.feature';
import { ListReportedUsersFeature } from './features/list-reported-users.feature';
import { GetUserReportsSummaryFeature } from './features/get-user-reports-summary.feature';
import { ListServiceReportsFeature } from './features/list-service-reports.feature';
import { MarkReportReviewedFeature } from './features/mark-report-reviewed.feature';
import { CreateReportRequestDto } from './dtos/request/create-report.request.dto';
import { HasReportResponseDto } from './dtos/response/has-report.response.dto';
import { ReportedUsersPaginatedResponseDto } from './dtos/response/reported-users-paginated.response.dto';
import { UserReportsSummaryResponseDto } from './dtos/response/user-reports-summary.response.dto';
import { ServiceReportsPaginatedResponseDto } from './dtos/response/service-reports-paginated.response.dto';
import { MarkReviewedResponseDto } from './dtos/response/mark-reviewed.response.dto';

@ApiTags('Reports')
@ApiBearerAuth('bearer')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly checkMyServiceReportFeature: CheckMyServiceReportFeature,
    private readonly checkMyUserReportFeature: CheckMyUserReportFeature,
    private readonly createServiceReportFeature: CreateServiceReportFeature,
    private readonly createUserReportFeature: CreateUserReportFeature,
    private readonly listReportedUsersFeature: ListReportedUsersFeature,
    private readonly getUserReportsSummaryFeature: GetUserReportsSummaryFeature,
    private readonly listServiceReportsFeature: ListServiceReportsFeature,
    private readonly markReportReviewedFeature: MarkReportReviewedFeature,
  ) {}

  // ─── Static routes first (before parameterized) ───────────────────────────

  @Get('services/has-report/:serviceId')
  @UseAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Check if the current user already has an active report on a service (within 24h cooldown)',
  })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, type: HasReportResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkMyServiceReport(
    @CurrentUser() user: AuthCurrentUser,
    @Param('serviceId') serviceId: string,
  ): Promise<HasReportResponseDto> {
    return this.checkMyServiceReportFeature.execute(user.id, serviceId);
  }

  @Get('users/has-report/:targetUserId')
  @UseAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Check if the current user already has an active report on a user profile (within 24h cooldown)',
  })
  @ApiParam({ name: 'targetUserId', description: 'Target user ID' })
  @ApiResponse({ status: 200, type: HasReportResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkMyUserReport(
    @CurrentUser() user: AuthCurrentUser,
    @Param('targetUserId') targetUserId: string,
  ): Promise<HasReportResponseDto> {
    return this.checkMyUserReportFeature.execute(user.id, targetUserId);
  }

  @Get('users')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Moderator] List users with pending reports' })
  @ApiResponse({ status: 200, type: ReportedUsersPaginatedResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async listReportedUsers(
    @Query() query: PaginateQueryDto,
  ): Promise<ReportedUsersPaginatedResponseDto> {
    return this.listReportedUsersFeature.execute(query.page, query.limit);
  }

  // ─── Parameterized routes ──────────────────────────────────────────────────

  @Post('services/:serviceId')
  @UseAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report a service' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 201, description: 'Report submitted' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({
    status: 429,
    description: 'Report cooldown active (must wait 24h)',
  })
  async createServiceReport(
    @CurrentUser() user: AuthCurrentUser,
    @Param('serviceId') serviceId: string,
    @Body() dto: CreateReportRequestDto,
  ): Promise<void> {
    await this.createServiceReportFeature.execute(
      user.id,
      serviceId,
      dto.subject,
      dto.description,
    );
  }

  @Post('users/:targetUserId')
  @UseAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report a user profile' })
  @ApiParam({ name: 'targetUserId', description: 'Target user ID' })
  @ApiResponse({ status: 201, description: 'Report submitted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 429,
    description: 'Report cooldown active (must wait 24h)',
  })
  async createUserReport(
    @CurrentUser() user: AuthCurrentUser,
    @Param('targetUserId') targetUserId: string,
    @Body() dto: CreateReportRequestDto,
  ): Promise<void> {
    await this.createUserReportFeature.execute(
      user.id,
      targetUserId,
      dto.subject,
      dto.description,
    );
  }

  @Get('users/:targetUserId')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      '[Moderator] Get grouped reports summary for a user (profile reports + services with reports)',
  })
  @ApiParam({ name: 'targetUserId', description: 'Target user ID' })
  @ApiResponse({ status: 200, type: UserReportsSummaryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserReportsSummary(
    @Param('targetUserId') targetUserId: string,
  ): Promise<UserReportsSummaryResponseDto> {
    return this.getUserReportsSummaryFeature.execute(targetUserId);
  }

  @Get('services/:serviceId')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Moderator] List reports for a specific service' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, type: ServiceReportsPaginatedResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async listServiceReports(
    @Param('serviceId') serviceId: string,
    @Query() query: PaginateQueryDto,
  ): Promise<ServiceReportsPaginatedResponseDto> {
    return this.listServiceReportsFeature.execute(
      serviceId,
      query.page,
      query.limit,
    );
  }

  @Patch(':id/reviewed')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Moderator] Mark a report as reviewed' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, type: MarkReviewedResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async markReviewed(
    @Param('id') id: string,
  ): Promise<MarkReviewedResponseDto> {
    return this.markReportReviewedFeature.execute(id);
  }
}
