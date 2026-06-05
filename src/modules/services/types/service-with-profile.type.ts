import { Prisma } from '@prisma/client';

export const SERVICE_WITH_PROFILE_SELECT = {
  id: true,
  title: true,
  description: true,
  keywords: true,
  price: true,
  status: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          profilePictureUrl: true,
        },
      },
    },
  },
} satisfies Prisma.ServiceSelect;

export type ServiceWithProfile = Prisma.ServiceGetPayload<{
  select: typeof SERVICE_WITH_PROFILE_SELECT;
}>;
