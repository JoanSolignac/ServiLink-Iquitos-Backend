import { UserRole, UserStatus } from '@prisma/client';

export interface AuthCurrentUser {
  id: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  hasProfile: boolean;
  emailVerified: boolean;
  isPremium: boolean;
  bannedUntil: Date | null;
  // Identificador completo del usuario en Auth0 (sub del JWT), ej. "auth0|abc123"
  authProviderId: string;
}
