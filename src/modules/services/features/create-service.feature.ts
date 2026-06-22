import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceCreatedEvent } from '@modules/services/events/service-created.event';
import { SERVICE_WITH_PROFILE_SELECT } from '@modules/services/types/service-with-profile.type';
import { ServiceLimitReachedException } from '@modules/services/exceptions/service-limit-reached.exception';

@Injectable()
export class CreateServiceFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter2: EventEmitter2,
  ) {}

  async execute(
    userId: string,
    title: string,
    description: string,
    price: number | null | undefined,
    keywords: string[],
    pricingUnit?: string,
    imageUrls: string[] = [],
  ): Promise<void> {
    console.log('CreateServiceFeature.execute: Starting execution', {
      userId,
      title,
      description,
      price,
      keywords,
      pricingUnit,
      imageUrls,
    });

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true },
    });

    if (!currentUser?.isPremium) {
      const serviceCount = await this.prisma.service.count({
        where: { userId },
      });
      if (serviceCount >= 2) {
        throw new ServiceLimitReachedException();
      }
    }

    console.log(
      'CreateServiceFeature.execute: Inserting service in database...',
    );
    const service = await this.prisma.service.create({
      data: {
        userId,
        title,
        description,
        price: price ?? null,
        pricingUnit: pricingUnit ?? null,
        keywords,
        imageUrls,
        status: ServiceStatus.REQUIRE_REVIEW,
      },
      select: SERVICE_WITH_PROFILE_SELECT,
    });
    console.log('CreateServiceFeature.execute: Service inserted successfully', {
      serviceId: service.id,
      status: service.status,
    });

    const user = service.user;
    const profile = user.profile;

    const userName =
      `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();

    const event = new ServiceCreatedEvent(userName, user.email, service.title);

    console.log(
      'CreateServiceFeature.execute: Emitting ServiceCreatedEvent...',
      {
        userName,
        email: user.email,
        title: service.title,
      },
    );
    await this.eventEmitter2.emitAsync(ServiceCreatedEvent.name, event);
    console.log(
      'CreateServiceFeature.execute: Event emitted and execution finished',
    );
  }
}
