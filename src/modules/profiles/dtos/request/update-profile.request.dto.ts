import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileRequestDto {
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
