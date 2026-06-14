import { Injectable } from '@nestjs/common';
import { ServiceRequestStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { RatingAlreadyExistsException } from '@modules/ratings/exceptions/rating-already-exists.exception';
import { RatingNotAllowedException } from '@modules/ratings/exceptions/rating-not-allowed.exception';
import {
  RATING_SELECT,
  RatingResult,
} from '@modules/ratings/types/rating.type';

const RATEABLE_STATUSES: ServiceRequestStatus[] = [
  ServiceRequestStatus.CONFIRMED,
  ServiceRequestStatus.REJECTED,
];

@Injectable()
export class CreateRatingFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    serviceRequestId: string,
    customerId: string,
    score: number,
    comment: string,
  ): Promise<RatingResult> {
    const serviceRequest = await this.prisma.serviceRequests.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true,
        customerId: true,
        serviceId: true,
        status: true,
        isRated: true,
      },
    });

    if (!serviceRequest) {
      throw new RatingNotAllowedException(
        'Service request not found or not rateable',
      );
    }

    if (serviceRequest.customerId !== customerId) {
      throw new RatingNotAllowedException(
        'Only the customer can rate this service request',
      );
    }

    if (!RATEABLE_STATUSES.includes(serviceRequest.status)) {
      throw new RatingNotAllowedException(
        'Service request must be CONFIRMED or REJECTED to be rated',
      );
    }

    if (serviceRequest.isRated) {
      throw new RatingAlreadyExistsException();
    }

    const rating = await this.prisma.rating.create({
      data: {
        serviceRequestId,
        serviceId: serviceRequest.serviceId,
        customerId,
        score,
        comment,
      },
      select: RATING_SELECT,
    });

    await this.prisma.serviceRequests.update({
      where: { id: serviceRequestId },
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
