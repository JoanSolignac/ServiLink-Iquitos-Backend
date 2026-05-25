import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../../../shared/enums/user-role.enum';

export const ROLE_KEY = 'role';

export const Role = (roles: UserRole[]) => SetMetadata(ROLE_KEY, roles);
