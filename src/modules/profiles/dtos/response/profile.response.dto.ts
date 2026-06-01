import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ description: 'User ID', example: 'auth0|123456789' })
  declare userId: string;

  @ApiProperty({ description: "User's first name", example: 'Juan' })
  declare firstName: string;

  @ApiProperty({ description: "User's last name", example: 'Perez' })
  declare lastName: string;

  @ApiProperty({
    description: "User's birth date",
    example: '1990-01-01T00:00:00.000Z',
  })
  declare birthDate: Date;

  @ApiProperty({
    description: 'Profile picture URL',
    example:
      'https://abc123.supabase.co/storage/v1/object/public/profiles/2025-05-01-uuid.jpg',
    nullable: true,
  })
  declare profilePictureUrl: string | null;

  @ApiProperty({
    description: 'Short biography',
    example: 'Experienced plumber',
    nullable: true,
  })
  declare bio: string | null;

  @ApiProperty({
    description: 'Phone number',
    example: '+51999999999',
    nullable: true,
  })
  declare phone: string | null;

  @ApiProperty({
    description: 'Physical address',
    example: 'Iquitos, Peru',
    nullable: true,
  })
  declare address: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-05-31T10:00:00.000Z',
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-05-31T12:30:00.000Z',
  })
  declare updatedAt: Date;
}
