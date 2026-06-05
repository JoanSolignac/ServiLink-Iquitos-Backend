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
export class RejectServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    actorId: string,
  ): Promise<ServiceRequestWithCustomer> {
    const serviceRequest = await ensureServiceRequestWithCustomer(
      this.prisma,
      id,
    );

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

    return this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.REJECTED },
      select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
    });
  }
}
