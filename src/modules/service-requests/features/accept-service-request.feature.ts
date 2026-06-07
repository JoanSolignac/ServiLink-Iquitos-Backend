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
import { ServiceRequestAccepted } from '@modules/service-requests/events/service-request-accepted.event';

@Injectable()
export class AcceptServiceRequestFeature {
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

    if (serviceRequest.status !== ServiceRequestStatus.PENDING) {
      throw new ServiceRequestInvalidTransitionException();
    }

    const updated = await this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.ACCEPTED },
      select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
    });

    const fcmTokens = updated.user.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      ServiceRequestAccepted.name,
      new ServiceRequestAccepted(fcmTokens, updated.service.title),
    );

    return updated;
  }
}
