import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import {
  ensureServiceRequestExistsById,
  ServiceRequestWithService,
} from '@modules/service-requests/utils/service-requests.util';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestInvalidTransitionException } from '@modules/service-requests/exceptions/service-request-invalid-transition.exception';

@Injectable()
export class ConfirmServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    customerId: string,
  ): Promise<ServiceRequestWithService> {
    const serviceRequest = await ensureServiceRequestExistsById(
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
      include: { service: true },
    });
  }
}
