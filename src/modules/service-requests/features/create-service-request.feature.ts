import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus, ServiceStatus } from '@prisma/client';
import { ServiceRequestWithService } from '@modules/service-requests/utils/service-requests.util';
import { ServiceNotFoundException } from '@modules/services/exceptions/service-not-found.exception';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestAlreadyExistsException } from '@modules/service-requests/exceptions/service-request-already-exists.exception';

type CreateServiceRequestInput = {
  customerId: string;
  serviceId: string;
  description: string;
};

@Injectable()
export class CreateServiceRequestFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: CreateServiceRequestInput,
  ): Promise<ServiceRequestWithService> {
    const service = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!service) {
      throw new ServiceNotFoundException();
    }

    if (service.status !== ServiceStatus.APPROVED) {
      throw new ServiceNotFoundException();
    }

    if (service.userId === input.customerId) {
      throw new ServiceRequestUnauthorizedException();
    }

    const existingActive = await this.prisma.serviceRequests.findFirst({
      where: {
        customerId: input.customerId,
        serviceId: input.serviceId,
        status: ServiceStatus.PENDING || ServiceStatus.APPROVED,
      },
    });

    if (existingActive) {
      throw new ServiceRequestAlreadyExistsException();
    }

    return this.prisma.serviceRequests.create({
      data: {
        customerId: input.customerId,
        serviceId: input.serviceId,
        description: input.description,
        status: ServiceRequestStatus.PENDING,
      },
      include: { service: true },
    });
  }
}
