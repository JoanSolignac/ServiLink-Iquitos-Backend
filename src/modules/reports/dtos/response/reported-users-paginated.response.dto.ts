import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { ReportedUserItemResponseDto } from './reported-user-item.response.dto';

export class ReportedUsersPaginatedResponseDto extends PaginatedResultResponseDto<ReportedUserItemResponseDto> {
  @ApiProperty({ type: [ReportedUserItemResponseDto] })
  declare data: ReportedUserItemResponseDto[];
}
