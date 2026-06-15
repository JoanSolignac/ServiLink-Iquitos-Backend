import { Prisma } from '@prisma/client';

export const SERVICE_REQUEST_WITH_CUSTOMER_SELECT = {
  id: true,
  serviceId: true,
  customerId: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          profilePictureUrl: true,
        },
      },
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
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          devices: {
            select: { fcmToken: true },
          },
        },
      },
    },
  },
} satisfies Prisma.ServiceRequestsSelect;

export type ServiceRequestWithCustomer = Prisma.ServiceRequestsGetPayload<{
  select: typeof SERVICE_REQUEST_WITH_CUSTOMER_SELECT;
}>;
