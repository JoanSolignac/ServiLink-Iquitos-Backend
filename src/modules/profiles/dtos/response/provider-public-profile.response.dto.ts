import { ApiProperty } from '@nestjs/swagger';

export class ServiceSummaryResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare serviceId: string;

  @ApiProperty({ example: 'Plomería a domicilio' })
  declare title: string;

  @ApiProperty({ example: 'Reparación de tuberías y desagües.' })
  declare description: string;

  @ApiProperty({ example: 50.0, nullable: true })
  declare price: number | null;

  @ApiProperty({ example: 'por hora', nullable: true })
  declare pricingUnit: string | null;

  @ApiProperty({ example: 4.5 })
  declare averageRating: number;
}

export class ServiceSummaryPaginatedResponseDto {
  @ApiProperty({ type: [ServiceSummaryResponseDto] })
  declare data: ServiceSummaryResponseDto[];

  @ApiProperty({ example: 10 })
  declare total: number;

  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 10 })
  declare limit: number;
}

export class ProviderPublicProfileResponseDto {
  @ApiProperty({ example: 'auth0|123456789' })
  declare userId: string;

  @ApiProperty({ example: 'Juan' })
  declare firstName: string;

  @ApiProperty({ example: 'Perez' })
  declare lastName: string;

  @ApiProperty({
    example: 'Plomero con 10 años de experiencia',
    nullable: true,
  })
  declare bio: string | null;

  @ApiProperty({ example: '+51999999999', nullable: true })
  declare phone: string | null;

  @ApiProperty({ example: 'Iquitos, Peru', nullable: true })
  declare address: string | null;

  @ApiProperty({
    example:
      'https://abc123.supabase.co/storage/v1/object/public/profiles/pic.jpg',
    nullable: true,
  })
  declare profilePictureUrl: string | null;

  @ApiProperty({ example: false })
  declare isPremium: boolean;

  @ApiProperty({ example: 4.2 })
  declare overallRating: number;

  @ApiProperty({ type: ServiceSummaryPaginatedResponseDto })
  declare services: ServiceSummaryPaginatedResponseDto;
}
