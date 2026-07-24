import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ensureServiceExistById } from '@modules/services/utils/services.util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceRejectedEvent } from '@modules/services/events/service-rejected.event';

@Injectable()
export class RejectServiceFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(serviceId: string): Promise<void> {
    const existing = await ensureServiceExistById(this.prisma, serviceId);

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { status: ServiceStatus.REJECTED },
    });

    const serviceWithUser = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: { include: { profile: true } } },
    });

    if (serviceWithUser?.user?.profile) {
      const userName = `${serviceWithUser.user.profile.firstName} ${serviceWithUser.user.profile.lastName}`;
      await this.eventEmitter.emitAsync(
        ServiceRejectedEvent.name,
        new ServiceRejectedEvent(
          userName,
          serviceWithUser.user.email,
          existing.title,
        ),
      );
    }
  }
}
