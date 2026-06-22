import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the service',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  declare id: string;

  @ApiProperty({
    description: 'ID of the user who owns the service',
    example: 'user-uuid-1234',
  })
  declare userId: string;

  @ApiProperty({
    description: 'Title of the service',
    example: 'Plumbing Repair',
  })
  declare title: string;

  @ApiProperty({
    description: 'Detailed description of the service',
    example: 'Fix leaks and broken pipes',
  })
  declare description: string;

  @ApiProperty({
    description: 'Price of the service. Null means negotiable.',
    example: 45.5,
    nullable: true,
  })
  declare price: number | null;

  @ApiProperty({
    description: 'Unit of pricing (e.g. "por hora", "m²", "sesión")',
    example: 'por hora',
    nullable: true,
  })
  declare pricingUnit: string | null;

  @ApiProperty({
    description: 'Current status of the service',
    enum: ServiceStatus,
    example: ServiceStatus.APPROVED,
  })
  declare status: ServiceStatus;

  @ApiProperty({
    description: 'Keywords associated with the service',
    example: ['plumbing', 'repair', 'pipes'],
    type: [String],
  })
  declare keywords: string[];

  @ApiProperty({
    description: 'Creation timestamp in ISO 8601 format',
    example: '2025-05-31T10:00:00.000Z',
  })
  declare createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp in ISO 8601 format',
    example: '2025-05-31T12:30:00.000Z',
  })
  declare updatedAt: string;
}
