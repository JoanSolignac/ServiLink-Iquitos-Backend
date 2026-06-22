import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckPhoneQueryDto {
  @ApiProperty({ example: '+51999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
