import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CheckDniQueryDto {
  @ApiProperty({ description: 'DNI (8 numeric digits)', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'DNI must be exactly 8 numeric digits' })
  declare dni: string;
}
