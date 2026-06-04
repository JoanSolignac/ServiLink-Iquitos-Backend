import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({
    description: 'Description of what the customer needs',
    example: 'I need my bathroom pipes fixed as soon as possible',
  })
  @IsString()
  @IsNotEmpty()
  declare description: string;
}
