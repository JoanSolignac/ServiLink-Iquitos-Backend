import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { ServiceWithProfileResponseDto } from './service-with-profile.response.dto';

export class ServiceWithProfilePaginatedResponseDto extends PaginatedResultResponseDto<ServiceWithProfileResponseDto> {
  @ApiProperty({ type: [ServiceWithProfileResponseDto] })
  declare data: ServiceWithProfileResponseDto[];
}
