import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { ServiceReportItemResponseDto } from './service-report-item.response.dto';

export class ServiceReportsPaginatedResponseDto extends PaginatedResultResponseDto<ServiceReportItemResponseDto> {
  @ApiProperty({ type: [ServiceReportItemResponseDto] })
  declare data: ServiceReportItemResponseDto[];
}
