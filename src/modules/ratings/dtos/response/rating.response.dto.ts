import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare id: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f01234567891' })
  declare serviceRequestId: string;

  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  declare score: number;

  @ApiProperty({ example: 'Excellent service, very professional.' })
  declare comment: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  declare createdAt: Date;
}
