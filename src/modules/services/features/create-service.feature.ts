import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceCreatedEvent } from '@modules/services/events/service-created.event';
import { SERVICE_WITH_PROFILE_SELECT } from '@modules/services/types/service-with-profile.type';

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
    price: number,
    keywords: string[],
  ): Promise<void> {
    const service = await this.prisma.service.create({
      data: {
        userId,
        title,
        description,
        price,
        keywords,
        status: ServiceStatus.REQUIRE_REVIEW,
      },
      select: SERVICE_WITH_PROFILE_SELECT,
    });

    const user = service.user;
    const profile = user.profile;

    const userName =
      `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();

    const event = new ServiceCreatedEvent(userName, user.email, service.title);

    await this.eventEmitter2.emitAsync(ServiceCreatedEvent.name, event);
  }
}
