import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { ReceivedServiceRequestResponseDto } from './received-service-request.response.dto';

export class ReceivedServiceRequestPaginatedResponseDto extends PaginatedResultResponseDto<ReceivedServiceRequestResponseDto> {
  @ApiProperty({ type: [ReceivedServiceRequestResponseDto] })
  declare data: ReceivedServiceRequestResponseDto[];
}
