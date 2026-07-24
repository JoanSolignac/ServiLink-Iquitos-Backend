import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 10 })
  declare limit: number;

  @ApiProperty({ example: 100 })
  declare total: number;
}

export class PaginatedResultResponseDto<T> {
  declare data: T[];

  @ApiProperty({ type: PaginatedMetaDto })
  declare meta: PaginatedMetaDto;
}
