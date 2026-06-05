import { Prisma } from '@prisma/client';

export const MY_SERVICE_SELECT = {
  id: true,
  title: true,
  description: true,
  keywords: true,
  price: true,
  status: true,
  createdAt: true,
} satisfies Prisma.ServiceSelect;

export type MyService = Prisma.ServiceGetPayload<{
  select: typeof MY_SERVICE_SELECT;
}>;
