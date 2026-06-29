import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReportRequestDto {
  @ApiProperty({ example: 'Servicio fraudulento' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  subject: string;

  @ApiProperty({
    example: 'El proveedor no cumplió con lo acordado y desapareció.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}
