import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';

export class ListMyServicesQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    description:
      'Search term to filter services by title, description or keywords',
    example: 'repair',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter services by their current status',
    enum: ServiceStatus,
    example: ServiceStatus.APPROVED,
  })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;
}
