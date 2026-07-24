import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class MeResponseDto {
  @ApiProperty({ description: 'User ID', example: 'auth0|123456789' })
  declare id: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  declare role: UserRole;

  @ApiProperty({
    description: 'User account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  declare status: UserStatus;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  declare email: string;

  @ApiProperty({
    description: 'Whether the user has completed their profile',
    example: true,
  })
  declare hasProfile: boolean;

  @ApiProperty({
    description: 'Whether the user email has been verified in Auth0',
    example: true,
  })
  declare emailVerified: boolean;

  @ApiProperty({
    description: 'Whether the user has an active premium subscription',
    example: false,
  })
  declare isPremium: boolean;

  @ApiProperty({
    description: 'Date until which the user is banned, or null if not banned',
    example: null,
    nullable: true,
  })
  declare bannedUntil: Date | null;
}
