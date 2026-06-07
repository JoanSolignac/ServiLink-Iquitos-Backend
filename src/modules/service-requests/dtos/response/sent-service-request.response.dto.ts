import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceRequestStatus, ServiceStatus } from '@prisma/client';

class SentServiceSummaryDto {
  @ApiProperty({
    description: 'Título del servicio solicitado',
    example: 'Plumbing Repair',
  })
  declare title: string;

  @ApiProperty({ description: 'Precio base del servicio', example: 45.5 })
  declare price: number;

  @ApiProperty({
    description: 'Estado actual del servicio',
    enum: ServiceStatus,
    example: ServiceStatus.APPROVED,
  })
  declare status: ServiceStatus;
}

class ProviderSummaryDto {
  @ApiProperty({
    description: 'Nombre del proveedor del servicio',
    example: 'Carlos',
  })
  declare firstName: string;

  @ApiProperty({
    description: 'Apellido del proveedor del servicio',
    example: 'López',
  })
  declare lastName: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil del proveedor',
    example: 'https://cdn.example.com/avatar.jpg',
  })
  declare pictureProfileUrl?: string;
}

export class SentServiceRequestResponseDto {
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

  @ApiProperty({ type: SentServiceSummaryDto })
  declare service: SentServiceSummaryDto;

  @ApiProperty({ type: ProviderSummaryDto })
  declare provider: ProviderSummaryDto;

  @ApiProperty({ example: '2025-05-31T10:00:00.000Z' })
  declare createdAt: string;

  @ApiProperty({ example: '2025-05-31T12:30:00.000Z' })
  declare updatedAt: string;
}
