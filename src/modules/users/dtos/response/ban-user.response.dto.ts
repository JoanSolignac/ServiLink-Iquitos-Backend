import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class BanUserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare id: string;

  @ApiProperty({ enum: UserStatus, example: UserStatus.SUSPENDED })
  declare status: UserStatus;

  @ApiPropertyOptional({
    description: 'Fecha de expiración del ban. Null = indefinido.',
    example: '2026-07-15T11:00:00.000Z',
    nullable: true,
  })
  declare bannedUntil: Date | null;
}
