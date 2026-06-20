import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare id: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f01234567891' })
  declare serviceId: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-012345678912' })
  declare customerId: string;

  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  declare score: number;

  @ApiProperty({ example: 'Excellent service, very professional.' })
  declare comment: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  declare updatedAt: Date;
}
