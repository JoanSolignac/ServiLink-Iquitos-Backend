import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateRatingRequestDto {
  @ApiPropertyOptional({ example: 4, minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({ example: 'Excellent service, very professional.' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  comment?: string;
}
