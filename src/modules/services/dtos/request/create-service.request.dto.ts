import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({
    description: 'Title of the service',
    example: 'House Cleaning',
  })
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @ApiProperty({
    description: 'Detailed description of the service',
    example: 'Professional house cleaning service in Iquitos',
  })
  @IsString()
  @IsNotEmpty()
  declare description: string;

  @ApiProperty({
    description: 'Price of the service',
    minimum: 0,
    example: 50.0,
  })
  @IsNumber()
  @Min(0)
  declare price: number;

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
