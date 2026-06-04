import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceRequestStatus } from '@prisma/client';
import { PaginateQueryDto } from '@common/dtos/request/paginate-query.request.dto';

export class ListServiceRequestsQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    description: 'Filter service requests by status',
    enum: ServiceRequestStatus,
    example: ServiceRequestStatus.PENDING,
  })
  @IsEnum(ServiceRequestStatus)
  @IsOptional()
  status?: ServiceRequestStatus;
}
