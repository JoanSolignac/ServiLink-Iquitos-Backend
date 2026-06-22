import { ApiProperty } from '@nestjs/swagger';

export class CheckFavoriteResponseDto {
  @ApiProperty({ example: false })
  declare isFavorite: boolean;
}
