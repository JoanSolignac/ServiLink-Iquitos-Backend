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
export class RejectServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    actorId: string,
  ): Promise<ServiceRequestWithService> {
    const serviceRequest = await ensureServiceRequestExistsById(
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
      include: { service: true },
    });
  }
}
