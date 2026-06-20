import { Prisma } from '@prisma/client';

export const RATING_SELECT = {
  id: true,
  serviceId: true,
  customerId: true,
  score: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RatingSelect;

export type RatingResult = Prisma.RatingGetPayload<{
  select: typeof RATING_SELECT;
}>;
