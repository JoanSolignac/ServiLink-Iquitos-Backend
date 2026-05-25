import { UserRole } from '../../../../../shared/enums/user-role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';

export class UserResponseDto {
  declare id: string;
  declare email: string;
  declare role: UserRole;
  declare status: UserStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}
