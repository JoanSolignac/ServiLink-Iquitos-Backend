import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @IsString()
  @IsNotEmpty()
  declare description: string;

  @IsNumber()
  @Min(0)
  declare price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  declare keywords?: string[];
}
