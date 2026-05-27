import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { UserEmail } from '../../../users/domain/value-objects/user-email.value-object';

export interface AuthCurrentUser {
  id: UserId;
  role: UserRole;
  email: UserEmail;
  hasProfile: boolean;
}
