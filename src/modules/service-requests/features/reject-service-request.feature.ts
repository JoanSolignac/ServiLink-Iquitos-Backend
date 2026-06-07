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
import { ServiceRequestRejected } from '@modules/service-requests/events/service-request-rejected.event';

@Injectable()
export class RejectServiceRequestFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    actorId: string,
  ): Promise<ServiceRequestWithCustomer> {
    const serviceRequest = await ensureServiceRequestWithCustomer(
      this.prisma,
      id,
    );

    // Capturar el status original antes del update para determinar el actor
    const rejectedByProvider =
      serviceRequest.status === ServiceRequestStatus.PENDING;

    if (serviceRequest.status === ServiceRequestStatus.PENDING) {
      if (serviceRequest.service.userId !== actorId) {
        throw new ServiceRequestUnauthorizedException();
      }
    } else if (serviceRequest.status === ServiceRequestStatus.FINISHED) {
      if (serviceRequest.customerId !== actorId) {
        throw new ServiceRequestUnauthorizedException();
      }
    } else {
      throw new ServiceRequestInvalidTransitionException();
    }

    const updated = await this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.REJECTED },
      select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
    });

    // Proveedor rechaza desde PENDING → notificar al cliente
    // Cliente rechaza desde FINISHED → notificar al proveedor
    const fcmTokens = rejectedByProvider
      ? updated.user.devices.map((d) => d.fcmToken)
      : updated.service.user.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      ServiceRequestRejected.name,
      new ServiceRequestRejected(
        fcmTokens,
        updated.service.title,
        rejectedByProvider,
      ),
    );

    return updated;
  }
}
