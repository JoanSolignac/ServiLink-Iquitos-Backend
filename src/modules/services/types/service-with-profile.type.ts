import { Prisma } from '@prisma/client';

const BASE_SERVICE_SELECT = {
  id: true,
  title: true,
  description: true,
  keywords: true,
  imageUrls: true,
  price: true,
  pricingUnit: true,
  status: true,
  averageRating: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          profilePictureUrl: true,
          phone: true,
        },
      },
    },
  },
} satisfies Prisma.ServiceSelect;

export const SERVICE_WITH_PROFILE_SELECT = {
  ...BASE_SERVICE_SELECT,
} satisfies Prisma.ServiceSelect;

export const SERVICE_DETAIL_SELECT = {
  ...BASE_SERVICE_SELECT,
  ratings: {
    select: {
      score: true,
      comment: true,
      createdAt: true,
      customer: {
        select: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.ServiceSelect;

export type ServiceWithProfile = Prisma.ServiceGetPayload<{
  select: typeof SERVICE_WITH_PROFILE_SELECT;
}>;

export type ServiceDetail = Prisma.ServiceGetPayload<{
  select: typeof SERVICE_DETAIL_SELECT;
}>;
