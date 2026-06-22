import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class FavoriteServiceResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare serviceId: string;

  @ApiProperty({ example: 'Plomería a domicilio' })
  declare title: string;

  @ApiProperty({ example: 'Reparación de tuberías y desagües.' })
  declare description: string;

  @ApiProperty({ example: ['plomería', 'reparación', 'tuberías'] })
  declare keywords: string[];

  @ApiProperty({ example: 50.0, nullable: true })
  declare price: number | null;

  @ApiPropertyOptional({ example: 'por hora', nullable: true })
  declare pricingUnit: string | null;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.APPROVED })
  declare status: ServiceStatus;

  @ApiProperty({ example: 'Juan Pérez' })
  declare providerName: string;

  @ApiPropertyOptional({
    example:
      'https://abc123.supabase.co/storage/v1/object/public/profiles/pic.jpg',
  })
  declare providerPictureUrl?: string;

  @ApiProperty({ example: 4.5 })
  declare averageRating: number;
}
