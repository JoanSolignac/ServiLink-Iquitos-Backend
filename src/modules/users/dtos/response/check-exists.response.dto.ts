import { ApiProperty } from '@nestjs/swagger';

export class CheckExistsResponseDto {
  @ApiProperty({ example: false })
  declare exists: boolean;
}
