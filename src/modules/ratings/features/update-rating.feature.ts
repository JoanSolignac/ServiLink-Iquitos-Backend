import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RatingNotFoundException } from '@modules/ratings/exceptions/rating-not-found.exception';
import {
  RATING_SELECT,
  RatingResult,
} from '@modules/ratings/types/rating.type';

@Injectable()
export class UpdateRatingFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    serviceId: string,
    customerId: string,
    score?: number,
    comment?: string,
  ): Promise<RatingResult> {
    const existing = await this.prisma.rating.findUnique({
      where: { serviceId_customerId: { serviceId, customerId } },
      select: { id: true },
    });

    if (!existing) {
      throw new RatingNotFoundException();
    }

    const rating = await this.prisma.rating.update({
      where: { serviceId_customerId: { serviceId, customerId } },
      data: {
        ...(score !== undefined && { score }),
        ...(comment !== undefined && { comment }),
      },
      select: RATING_SELECT,
    });

    if (score !== undefined) {
      await this.recalculateAverageRating(serviceId);
    }

    return rating;
  }

  private async recalculateAverageRating(serviceId: string): Promise<void> {
    const agg = await this.prisma.rating.aggregate({
      where: { serviceId },
      _avg: { score: true },
    });
    await this.prisma.service.update({
      where: { id: serviceId },
      data: { averageRating: agg._avg.score ?? 0 },
    });
  }
}
