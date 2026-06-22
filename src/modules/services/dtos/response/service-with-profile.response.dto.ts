import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class ServiceWithProfileResponseDto {
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

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.APPROVED })
  declare status: ServiceStatus;

  @ApiProperty({ example: 'Juan Pérez' })
  declare providerName: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  declare providerPictureUrl?: string;

  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5 })
  declare averageRating: number;
}

export class ServiceRatingResponseDto {
  @ApiProperty({ example: 'Juan Pérez' })
  declare customerName: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  declare customerPictureUrl: string | null;

  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  declare score: number;

  @ApiProperty({ example: 'Buen servicio.' })
  declare comment: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  declare createdAt: Date;
}

export class ServiceDetailResponseDto extends ServiceWithProfileResponseDto {
  @ApiProperty({ type: [ServiceRatingResponseDto] })
  declare ratings: ServiceRatingResponseDto[];
}
