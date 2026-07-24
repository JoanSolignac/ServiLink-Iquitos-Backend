import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { normalizeToNextHour } from '@common/utils/normalize-to-next-hour.util';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';
import { ServiceAlreadyDisabledException } from '../exceptions/service-already-disabled.exception';
import { ServiceDisabledEvent } from '../events/service-disabled.event';

export interface DisableServiceInput {
  serviceId: string;
  disabledUntil: Date | null;
}

@Injectable()
export class DisableServiceFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: DisableServiceInput): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
      select: {
        id: true,
        title: true,
        status: true,
        user: {
          select: {
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!service) {
      throw new ServiceNotFoundException();
    }

    if (service.status === ServiceStatus.DISABLED) {
      throw new ServiceAlreadyDisabledException();
    }

    const disabledUntil =
      input.disabledUntil !== null
        ? normalizeToNextHour(input.disabledUntil)
        : null;

    await this.prisma.service.update({
      where: { id: input.serviceId },
      data: { status: ServiceStatus.DISABLED, disabledUntil },
    });

    const userName = service.user.profile
      ? `${service.user.profile.firstName} ${service.user.profile.lastName}`
      : service.user.email;

    this.eventEmitter.emit(
      ServiceDisabledEvent.name,
      new ServiceDisabledEvent(
        service.user.email,
        userName,
        service.title,
        disabledUntil,
      ),
    );
  }
}
