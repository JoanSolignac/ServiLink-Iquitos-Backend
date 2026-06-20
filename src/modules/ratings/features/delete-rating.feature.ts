import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RatingNotFoundException } from '@modules/ratings/exceptions/rating-not-found.exception';

@Injectable()
export class DeleteRatingFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string, customerId: string): Promise<void> {
    const existing = await this.prisma.rating.findUnique({
      where: { serviceId_customerId: { serviceId, customerId } },
      select: { id: true },
    });

    if (!existing) {
      throw new RatingNotFoundException();
    }

    await this.prisma.rating.delete({
      where: { serviceId_customerId: { serviceId, customerId } },
    });

    await this.recalculateAverageRating(serviceId);
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
