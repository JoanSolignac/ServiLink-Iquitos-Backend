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
import { ServiceRequestConfirmed } from '@modules/service-requests/events/service-request-confirmed.event';

@Injectable()
export class ConfirmServiceRequestFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    customerId: string,
  ): Promise<ServiceRequestWithProvider> {
    const serviceRequest = await ensureServiceRequestWithProvider(
      this.prisma,
      id,
    );

    if (serviceRequest.customerId !== customerId) {
      throw new ServiceRequestUnauthorizedException();
    }

    if (serviceRequest.status !== ServiceRequestStatus.FINISHED) {
      throw new ServiceRequestInvalidTransitionException();
    }

    const updated = await this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.CONFIRMED },
      select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
    });

    const fcmTokens = updated.service.user.devices.map((d) => d.fcmToken);

    await this.eventEmitter.emitAsync(
      ServiceRequestConfirmed.name,
      new ServiceRequestConfirmed(fcmTokens, updated.service.title),
    );

    return updated;
  }
}
