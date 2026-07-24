import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileRequestDto {
  @ApiProperty({ description: "User's first name", example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  declare firstName: string;

  @ApiProperty({ description: "User's last name", example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  declare lastName: string;

  @ApiProperty({ description: "User's birth date", example: '1990-01-01' })
  @IsDate()
  @Type(() => Date)
  declare birthDate: Date;

  @ApiProperty({
    description: 'DNI (8 numeric digits)',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'DNI must be exactly 8 numeric digits' })
  declare dni: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+51999999999' })
  @IsString()
  @IsOptional()
  declare phone?: string;

  @ApiPropertyOptional({
    description: 'Physical address',
    example: 'Iquitos, Peru',
  })
  @IsString()
  @IsOptional()
  declare address?: string;

  @ApiPropertyOptional({
    description: 'Short biography',
    example: 'Experienced plumber',
  })
  @IsString()
  @IsOptional()
  declare bio?: string;

  @ApiPropertyOptional({
    description: 'Profile picture file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  declare profilePicture?: any;
}
