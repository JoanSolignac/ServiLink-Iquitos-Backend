import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class MeResponseDto {
  @ApiProperty({ description: 'User ID', example: 'auth0|123456789' })
  declare id: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  declare role: UserRole;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  declare email: string;

  @ApiProperty({
    description: 'Whether the user has completed their profile',
    example: true,
  })
  declare hasProfile: boolean;
}
