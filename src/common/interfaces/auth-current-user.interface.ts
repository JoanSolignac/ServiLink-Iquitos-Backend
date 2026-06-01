import { UserRole } from '@prisma/client';

export interface AuthCurrentUser {
  id: string;
  role: UserRole;
  email: string;
  hasProfile: boolean;
}
