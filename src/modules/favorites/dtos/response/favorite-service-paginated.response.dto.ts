import { ApiProperty } from '@nestjs/swagger';
import { FavoriteServiceResponseDto } from './favorite-service.response.dto';

class FavoriteServiceMetaDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 10 })
  declare limit: number;

  @ApiProperty({ example: 25 })
  declare total: number;
}

export class FavoriteServicePaginatedResponseDto {
  @ApiProperty({ type: [FavoriteServiceResponseDto] })
  declare data: FavoriteServiceResponseDto[];

  @ApiProperty({ type: FavoriteServiceMetaDto })
  declare meta: FavoriteServiceMetaDto;
}
