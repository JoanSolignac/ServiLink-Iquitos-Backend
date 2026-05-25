import { UserRole } from '../../../../../shared/enums/user-role.enum';
import { IsEnum } from 'class-validator';

export class ChangeUserRoleRequestDto {
  @IsEnum(UserRole)
  declare role: UserRole;
}
