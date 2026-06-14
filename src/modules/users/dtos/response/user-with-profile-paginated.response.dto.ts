import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultResponseDto } from '@common/dtos/response/paginated-result.response.dto';
import { UserWithProfileResponseDto } from './user-with-profile.response.dto';

export class UserWithProfilePaginatedResponseDto extends PaginatedResultResponseDto<UserWithProfileResponseDto> {
  @ApiProperty({ type: [UserWithProfileResponseDto] })
  declare data: UserWithProfileResponseDto[];
}
