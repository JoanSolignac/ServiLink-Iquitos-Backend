import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserEmailRequestDto {
  @IsEmail()
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  declare email: string;
}
