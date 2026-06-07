import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ensureServiceRequestWithCustomer } from '@modules/service-requests/utils/service-requests.util';
import {
  SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
  ServiceRequestWithCustomer,
} from '@modules/service-requests/types/service-request-with-customer.type';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestInvalidTransitionException } from '@modules/service-requests/exceptions/service-request-invalid-transition.exception';
import { ServiceRequestFinished } from '@modules/service-requests/events/service-request-finished.event';

@Injectable()
export class FinishServiceRequestFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    providerId: string,
  ): Promise<ServiceRequestWithCustomer> {
    const serviceRequest = await ensureServiceRequestWithCustomer(
      this.prisma,
      id,
    );

    if (serviceRequest.service.userId !== providerId) {
      throw new ServiceRequestUnauthorizedException();
    }

    if (serviceRequest.status !== ServiceRequestStatus.ACCEPTED) {
      throw new ServiceRequestInvalidTransitionException();
    }

    const updated = await this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.FINISHED },
      select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
    });

    const fcmTokens = updated.user.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      ServiceRequestFinished.name,
      new ServiceRequestFinished(fcmTokens, updated.service.title),
    );

    return updated;
  }
}
