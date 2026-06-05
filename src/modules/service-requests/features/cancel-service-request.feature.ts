import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { ensureServiceRequestWithProvider } from '@modules/service-requests/utils/service-requests.util';
import {
  SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  ServiceRequestWithProvider,
} from '@modules/service-requests/types/service-request-with-provider.type';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestInvalidTransitionException } from '@modules/service-requests/exceptions/service-request-invalid-transition.exception';

@Injectable()
export class CancelServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.CANCELLED },
      select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
    });
  }
}
