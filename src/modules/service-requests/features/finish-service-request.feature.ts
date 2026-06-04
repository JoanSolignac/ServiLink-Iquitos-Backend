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
export class FinishServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    providerId: string,
  ): Promise<ServiceRequestWithService> {
    const serviceRequest = await ensureServiceRequestExistsById(
      this.prisma,
      id,
    );

    if (serviceRequest.service.userId !== providerId) {
      throw new ServiceRequestUnauthorizedException();
    }

    if (serviceRequest.status !== ServiceRequestStatus.ACCEPTED) {
      throw new ServiceRequestInvalidTransitionException();
    }

    return this.prisma.serviceRequests.update({
      where: { id },
      data: { status: ServiceRequestStatus.FINISHED },
      include: { service: true },
    });
  }
}
