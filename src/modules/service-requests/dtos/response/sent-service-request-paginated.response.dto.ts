import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { SentServiceRequestResponseDto } from './sent-service-request.response.dto';

export class SentServiceRequestPaginatedResponseDto extends PaginatedResultResponseDto<SentServiceRequestResponseDto> {
  @ApiProperty({ type: [SentServiceRequestResponseDto] })
  declare data: SentServiceRequestResponseDto[];
}
