import { UserRole } from '@prisma/client';

export interface AuthCurrentUser {
  id: string;
  role: UserRole;
  email: string;
  hasProfile: boolean;
  emailVerified: boolean;
  isPremium: boolean;
  // Identificador completo del usuario en Auth0 (sub del JWT), ej. "auth0|abc123"
  authProviderId: string;
}
