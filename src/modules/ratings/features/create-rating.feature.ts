import { Injectable } from '@nestjs/common';
import { ServiceRequestStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RatingAlreadyExistsException } from '@modules/ratings/exceptions/rating-already-exists.exception';
import { RatingNotAllowedException } from '@modules/ratings/exceptions/rating-not-allowed.exception';
import {
  RATING_SELECT,
  RatingResult,
} from '@modules/ratings/types/rating.type';
import { RatingCreated } from '@modules/ratings/events/rating-created.event';

const RATEABLE_STATUSES: ServiceRequestStatus[] = [
  ServiceRequestStatus.CONFIRMED,
  ServiceRequestStatus.REJECTED,
];

@Injectable()
export class CreateRatingFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
        service: {
          select: {
            title: true,
            user: {
              select: {
                email: true,
                profile: { select: { firstName: true, lastName: true } },
                devices: { select: { fcmToken: true } },
              },
            },
          },
        },
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

    const provider = serviceRequest.service.user;
    const providerName =
      `${provider.profile?.firstName ?? ''} ${provider.profile?.lastName ?? ''}`.trim();
    const fcmTokens = provider.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      RatingCreated.name,
      new RatingCreated(
        fcmTokens,
        provider.email,
        providerName,
        serviceRequest.service.title,
        score,
      ),
    );

    return rating;
  }
}
