import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceRequestDto {
  @ApiPropertyOptional({
    description: 'Title of the service',
    example: 'Deep House Cleaning',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the service',
    example: 'Deep cleaning including windows and carpets',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare description?: string;

  @ApiPropertyOptional({
    description: 'Price of the service',
    minimum: 0,
    example: 75.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  declare price?: number;

  @ApiPropertyOptional({
    description: 'Keywords associated with the service',
    example: ['deep cleaning', 'windows', 'carpets'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  declare keywords?: string[];
}
