import { ApiProperty } from '@nestjs/swagger';
import { ServiceReportItemResponseDto } from './service-report-item.response.dto';

export class ServiceGroupDto {
  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  serviceTitle: string;

  @ApiProperty()
  pendingReportCount: number;
}

export class UserReportsSummaryResponseDto {
  @ApiProperty({ type: [ServiceReportItemResponseDto] })
  profileReports: ServiceReportItemResponseDto[];

  @ApiProperty({ type: [ServiceGroupDto] })
  serviceGroups: ServiceGroupDto[];
}
