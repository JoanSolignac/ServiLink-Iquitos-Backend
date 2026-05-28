import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  declare price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  declare keywords?: string[];
}
