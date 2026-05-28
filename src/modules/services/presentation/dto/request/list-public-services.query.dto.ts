import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPublicServicesQueryDto {
  @IsString()
  @IsOptional()
  declare search?: string;

  @IsOptional()
  declare keywords?: string[];

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  declare page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  declare limit?: number;
}
