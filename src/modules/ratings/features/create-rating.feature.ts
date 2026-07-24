import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RatingAlreadyExistsException } from '@modules/ratings/exceptions/rating-already-exists.exception';
import { RatingNotAllowedException } from '@modules/ratings/exceptions/rating-not-allowed.exception';
import {
  RATING_SELECT,
  RatingResult,
} from '@modules/ratings/types/rating.type';
import { RatingCreated } from '@modules/ratings/events/rating-created.event';

@Injectable()
export class CreateRatingFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    serviceId: string,
    customerId: string,
    score: number,
    comment: string | undefined,
  ): Promise<RatingResult> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        userId: true,
        user: {
          select: {
            email: true,
            profile: { select: { firstName: true, lastName: true } },
            devices: { select: { fcmToken: true } },
          },
        },
      },
    });

    if (!service) {
      throw new RatingNotAllowedException('Service not found');
    }

    if (service.userId === customerId) {
      throw new RatingNotAllowedException('You cannot rate your own service');
    }

    const existing = await this.prisma.rating.findUnique({
      where: { serviceId_customerId: { serviceId, customerId } },
      select: { id: true },
    });

    if (existing) {
      throw new RatingAlreadyExistsException();
    }

    const rating = await this.prisma.rating.create({
      data: { serviceId, customerId, score, comment },
      select: RATING_SELECT,
    });

    await this.recalculateAverageRating(serviceId);

    const provider = service.user;
    const providerName =
      `${provider.profile?.firstName ?? ''} ${provider.profile?.lastName ?? ''}`.trim();
    const fcmTokens = provider.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      RatingCreated.name,
      new RatingCreated(
        fcmTokens,
        provider.email,
        providerName,
        service.title,
        score,
        serviceId,
      ),
    );

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
