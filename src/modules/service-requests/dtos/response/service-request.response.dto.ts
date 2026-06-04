import { ApiProperty } from '@nestjs/swagger';
import { ServiceRequestStatus, ServiceStatus } from '@prisma/client';

class ServiceSummaryDto {
  @ApiProperty({ example: 'Plumbing Repair' })
  declare title: string;

  @ApiProperty({ example: 45.5 })
  declare price: number;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.APPROVED })
  declare status: ServiceStatus;
}

export class ServiceRequestResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare id: string;

  @ApiProperty({ example: 'service-uuid-1234' })
  declare serviceId: string;

  @ApiProperty({ example: 'customer-uuid-5678' })
  declare customerId: string;

  @ApiProperty({ example: 'I need my bathroom pipes fixed' })
  declare description: string;

  @ApiProperty({
    enum: ServiceRequestStatus,
    example: ServiceRequestStatus.PENDING,
  })
  declare status: ServiceRequestStatus;

  @ApiProperty({ type: ServiceSummaryDto })
  declare service: ServiceSummaryDto;

  @ApiProperty({ example: '2025-05-31T10:00:00.000Z' })
  declare createdAt: string;

  @ApiProperty({ example: '2025-05-31T12:30:00.000Z' })
  declare updatedAt: string;
}
