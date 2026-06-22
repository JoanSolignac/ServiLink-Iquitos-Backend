import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  MaxLength,
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
    description: 'Price of the service. Send null to mark as negotiable.',
    minimum: 0,
    nullable: true,
    example: 75.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  declare price?: number | null;

  @ApiPropertyOptional({
    description: 'Unit of pricing (e.g. "por hora", "m²", "sesión")',
    example: 'por hora',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  declare pricingUnit?: string;

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
