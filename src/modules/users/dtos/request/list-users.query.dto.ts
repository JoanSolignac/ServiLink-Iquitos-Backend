import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';

export class ListUsersQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    description: 'Buscar por nombre, apellido o correo electrónico',
    example: 'juan',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
