import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileRequestDto {
  @IsString()
  @IsNotEmpty()
  declare firstName: string;

  @IsString()
  @IsNotEmpty()
  declare lastName: string;

  @IsDate()
  @Type(() => Date)
  declare birthDate: Date;

  @IsString()
  @IsOptional()
  declare phone?: string;

  @IsString()
  @IsOptional()
  declare address?: string;

  @IsString()
  @IsOptional()
  declare bio?: string;
}
