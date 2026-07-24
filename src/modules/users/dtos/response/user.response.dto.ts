import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  declare id: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  declare email: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  declare role: UserRole;

  @ApiProperty({
    description: 'Estado de la cuenta del usuario',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  declare status: UserStatus;

  @ApiPropertyOptional({
    description:
      'Fecha hasta cuando está baneado. Null = ban indefinido o no baneado.',
    example: '2026-07-15T11:00:00.000Z',
    nullable: true,
  })
  declare bannedUntil: Date | null;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-01-15T10:00:00.000Z',
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2025-05-31T12:30:00.000Z',
  })
  declare updatedAt: Date;
}
