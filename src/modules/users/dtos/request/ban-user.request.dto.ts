import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class BanUserRequestDto {
  @ApiPropertyOptional({
    description:
      'Fecha hasta cuando dura el ban en formato ISO 8601. Null o ausente = ban indefinido. La hora se redondeará al siguiente tope exacto.',
    example: '2026-07-15T10:30:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  declare bannedUntil?: string | null;
}
