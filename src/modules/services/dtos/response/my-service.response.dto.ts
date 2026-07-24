import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ServiceStatus } from '@prisma/client';

export class MyServiceResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare serviceId: string;

  @ApiProperty({ example: 'Plumbing Repair' })
  declare title: string;

  @ApiProperty({ example: 'Fix leaks and broken pipes' })
  declare description: string;

  @ApiProperty({ example: ['plumbing', 'repair'], type: [String] })
  declare keywords: string[];

  @ApiProperty({ example: 45.5, nullable: true })
  declare price: number | null;

  @ApiPropertyOptional({ example: 'por hora', nullable: true })
  declare pricingUnit: string | null;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.REQUIRE_REVIEW })
  declare status: ServiceStatus;

  @ApiPropertyOptional({
    description:
      'Fecha hasta cuando el servicio está desactivado. Null = desactivado indefinidamente o no desactivado.',
    example: '2026-07-15T11:00:00.000Z',
    nullable: true,
  })
  declare disabledUntil: Date | null;

  @ApiProperty({ example: ['https://example.com/img1.jpg'], type: [String] })
  declare imageUrls: string[];
}
