import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReportRequestDto {
  @ApiProperty({ example: 'Servicio fraudulento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  subject: string;

  @ApiPropertyOptional({
    example: 'El proveedor no cumplió con lo acordado y desapareció.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
