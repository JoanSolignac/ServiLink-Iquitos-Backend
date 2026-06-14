import { Injectable } from '@nestjs/common';
import { ServiceRequestStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { RatingNotAllowedException } from '@modules/ratings/exceptions/rating-not-allowed.exception';
import {
  RATING_SELECT,
  RatingResult,
} from '@modules/ratings/types/rating.type';

@Injectable()
export class CreateRatingByServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    serviceId: string,
    customerId: string,
    score: number,
    comment: string,
  ): Promise<RatingResult> {
    const serviceRequest = await this.prisma.serviceRequests.findFirst({
      where: {
        serviceId,
        customerId,
        status: {
          in: [ServiceRequestStatus.CONFIRMED, ServiceRequestStatus.REJECTED],
        },
        isRated: false,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, serviceId: true },
    });

    if (!serviceRequest) {
      throw new RatingNotAllowedException(
        'No eligible service request found for this service',
      );
    }

    const rating = await this.prisma.rating.create({
      data: {
        serviceRequestId: serviceRequest.id,
        serviceId: serviceRequest.serviceId,
        customerId,
        score,
        comment,
      },
      select: RATING_SELECT,
    });

    await this.prisma.serviceRequests.update({
      where: { id: serviceRequest.id },
      data: { isRated: true },
    });

    const agg = await this.prisma.rating.aggregate({
      where: { serviceId: serviceRequest.serviceId },
      _avg: { score: true },
    });

    await this.prisma.service.update({
      where: { id: serviceRequest.serviceId },
      data: { averageRating: agg._avg.score ?? 0 },
    });

    return rating;
  }
}
