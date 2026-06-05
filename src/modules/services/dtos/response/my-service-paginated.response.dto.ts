import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { MyServiceResponseDto } from './my-service.response.dto';

export class MyServicePaginatedResponseDto extends PaginatedResultResponseDto<MyServiceResponseDto> {
  @ApiProperty({ type: [MyServiceResponseDto] })
  declare data: MyServiceResponseDto[];
}
