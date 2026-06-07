import { Prisma } from '@prisma/client';

export const SERVICE_REQUEST_WITH_PROVIDER_SELECT = {
  id: true,
  serviceId: true,
  customerId: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      devices: {
        select: { fcmToken: true },
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
          email: true,
          devices: {
            select: {
              fcmToken: true,
            },
          },
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

export type ServiceRequestWithProvider = Prisma.ServiceRequestsGetPayload<{
  select: typeof SERVICE_REQUEST_WITH_PROVIDER_SELECT;
}>;
