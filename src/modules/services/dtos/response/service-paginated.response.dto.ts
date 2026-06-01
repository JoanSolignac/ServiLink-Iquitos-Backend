import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponseDto } from './service.response.dto';

export class ServicePaginatedResponseDto {
  @ApiProperty({
    description: 'List of services',
    type: [ServiceResponseDto],
  })
  declare data: ServiceResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: { page: 1, limit: 10, total: 42 },
  })
  declare meta: {
    page: number;
    limit: number;
    total: number;
  };
}
