import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { ensureServiceRequestWithCustomer } from '@modules/service-requests/utils/service-requests.util';
import {
  SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
  ServiceRequestWithCustomer,
} from '@modules/service-requests/types/service-request-with-customer.type';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestInvalidTransitionException } from '@modules/service-requests/exceptions/service-request-invalid-transition.exception';

@Injectable()
export class AcceptServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.ACCEPTED },
      select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
    });
  }
}
