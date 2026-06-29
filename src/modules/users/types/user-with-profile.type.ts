import { Prisma } from '@prisma/client';

export const USER_WITH_PROFILE_SELECT = {
  id: true,
  email: true,
  role: true,
  status: true,
  bannedUntil: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      firstName: true,
      lastName: true,
      profilePictureUrl: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserWithProfile = Prisma.UserGetPayload<{
  select: typeof USER_WITH_PROFILE_SELECT;
}>;
