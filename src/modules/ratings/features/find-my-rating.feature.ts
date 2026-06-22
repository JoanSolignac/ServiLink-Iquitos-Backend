import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from '@prisma/client';

const MY_RATING_SELECT = {
  id: true,
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
} satisfies Prisma.RatingSelect;

export type MyRating = Prisma.RatingGetPayload<{
  select: typeof MY_RATING_SELECT;
}>;

@Injectable()
export class FindMyRatingFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    serviceId: string,
    customerId: string,
  ): Promise<MyRating | null> {
    return this.prisma.rating.findUnique({
      where: { serviceId_customerId: { serviceId, customerId } },
      select: MY_RATING_SELECT,
    });
  }
}
