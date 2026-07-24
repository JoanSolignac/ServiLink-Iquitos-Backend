import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ensureServiceExistById } from '@modules/services/utils/services.util';
import { ServiceAlreadyApprovedException } from '@modules/services/exceptions/service-already-approved.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceApprovedEvent } from '@modules/services/events/service-approved.event';

@Injectable()
export class ApproveServiceFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(serviceId: string): Promise<void> {
    const existing = await ensureServiceExistById(this.prisma, serviceId);

    if (existing.status === ServiceStatus.APPROVED) {
      throw new ServiceAlreadyApprovedException();
    }

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { status: ServiceStatus.APPROVED },
    });

    const serviceWithUser = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: { include: { profile: true } } },
    });

    if (serviceWithUser?.user?.profile) {
      const userName = `${serviceWithUser.user.profile.firstName} ${serviceWithUser.user.profile.lastName}`;
      await this.eventEmitter.emitAsync(
        ServiceApprovedEvent.name,
        new ServiceApprovedEvent(
          userName,
          serviceWithUser.user.email,
          existing.title,
        ),
      );
    }
  }
}
