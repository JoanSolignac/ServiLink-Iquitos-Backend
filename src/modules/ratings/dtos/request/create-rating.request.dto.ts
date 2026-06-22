import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRatingRequestDto {
  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  score: number;

  @ApiPropertyOptional({ example: 'Excellent service, very professional.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
