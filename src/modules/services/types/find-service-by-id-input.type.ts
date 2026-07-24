import { UserRole } from '@prisma/client';

export type FindServiceByIdInput = {
  serviceId: string;
  requestingUserId?: string;
  requestingUserRole?: UserRole;
};
