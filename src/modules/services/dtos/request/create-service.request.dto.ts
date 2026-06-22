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

export class CreateServiceBodyDto {
  @ApiPropertyOptional({
    description: 'Title of the service',
    example: 'House Cleaning',
  })
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the service',
    example: 'Professional house cleaning service in Iquitos',
  })
  @IsString()
  @IsNotEmpty()
  declare description: string;

  @ApiPropertyOptional({
    description:
      'Price of the service. Omit or send null for negotiable price.',
    minimum: 0,
    nullable: true,
    example: 50.0,
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
    example: ['cleaning', 'home', 'iquitos'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  declare keywords?: string[];
}
