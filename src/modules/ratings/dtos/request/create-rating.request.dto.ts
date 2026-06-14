import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
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

  @ApiProperty({ example: 'Excellent service, very professional.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comment: string;
}
