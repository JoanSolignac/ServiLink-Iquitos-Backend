import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class ChangeUserRoleRequestDto {
  @ApiProperty({
    description: 'Nuevo rol a asignar al usuario',
    enum: UserRole,
    example: UserRole.MODERATOR,
  })
  @IsEnum(UserRole)
  declare role: UserRole;
}
