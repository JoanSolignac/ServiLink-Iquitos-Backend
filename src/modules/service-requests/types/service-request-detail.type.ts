import { Prisma } from '@prisma/client';

export const SERVICE_REQUEST_DETAIL_SELECT = {
  id: true,
  serviceId: true,
  customerId: true,
  description: true,
  status: true,
  isRated: true,
  createdAt: true,
  updatedAt: true,
  user: {
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
  service: {
    select: {
      userId: true,
      title: true,
      price: true,
      status: true,
      user: {
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
  },
} satisfies Prisma.ServiceRequestsSelect;

export type ServiceRequestDetail = Prisma.ServiceRequestsGetPayload<{
  select: typeof SERVICE_REQUEST_DETAIL_SELECT;
}>;
