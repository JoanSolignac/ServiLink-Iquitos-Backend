import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';

export class ListPublicServicesQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    description:
      'Search term to filter services by title, description or keywords',
    example: 'cleaning',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
