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
export class ConfirmServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.CONFIRMED },
      select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
    });
  }
}
