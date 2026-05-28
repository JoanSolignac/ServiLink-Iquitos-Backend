import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceStatus } from '../../../domain/enums/service-status.enum';

export class ListMyServicesQueryDto {
  @IsString()
  @IsOptional()
  declare search?: string;

  @IsOptional()
  declare keywords?: string[];

  @IsEnum(ServiceStatus)
  @IsOptional()
  declare status?: ServiceStatus;

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
