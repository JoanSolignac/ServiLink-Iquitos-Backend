import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ensureServiceRequestWithProvider } from '@modules/service-requests/utils/service-requests.util';
import {
  SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  ServiceRequestWithProvider,
} from '@modules/service-requests/types/service-request-with-provider.type';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestInvalidTransitionException } from '@modules/service-requests/exceptions/service-request-invalid-transition.exception';
import { ServiceRequestCancelled } from '@modules/service-requests/events/service-request-cancelled.event';

@Injectable()
export class CancelServiceRequestFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    actorId: string,
  ): Promise<ServiceRequestWithProvider> {
    const serviceRequest = await ensureServiceRequestWithProvider(
      this.prisma,
      id,
    );

    if (serviceRequest.status !== ServiceRequestStatus.ACCEPTED) {
      throw new ServiceRequestInvalidTransitionException();
    }

    const isCustomer = serviceRequest.customerId === actorId;
    const isProvider = serviceRequest.service.userId === actorId;

    if (!isCustomer && !isProvider) {
      throw new ServiceRequestUnauthorizedException();
    }

    const updated = await this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.CANCELLED },
      select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
    });

    // Cliente cancela → notificar al proveedor
    // Proveedor cancela → notificar al cliente
    const fcmTokens = isCustomer
      ? updated.service.user.devices.map((d) => d.fcmToken)
      : updated.user.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      ServiceRequestCancelled.name,
      new ServiceRequestCancelled(fcmTokens, updated.service.title, isCustomer),
    );

    return updated;
  }
}
