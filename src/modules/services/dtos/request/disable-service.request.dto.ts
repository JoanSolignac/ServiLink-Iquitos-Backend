import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class DisableServiceRequestDto {
  @ApiPropertyOptional({
    description:
      'Fecha hasta cuando el servicio estará desactivado en formato ISO 8601. Null o ausente = desactivación indefinida. La hora se redondeará al siguiente tope exacto.',
    example: '2026-07-15T10:30:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  declare disabledUntil?: string | null;
}
