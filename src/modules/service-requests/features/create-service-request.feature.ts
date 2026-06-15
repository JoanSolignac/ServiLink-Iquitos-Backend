import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus, ServiceStatus } from '@prisma/client';
import {
  SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  ServiceRequestWithProvider,
} from '@modules/service-requests/types/service-request-with-provider.type';
import { ServiceNotFoundException } from '@modules/services/exceptions/service-not-found.exception';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import { ServiceRequestAlreadyExistsException } from '@modules/service-requests/exceptions/service-request-already-exists.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceRequestCreated } from '@modules/service-requests/events/service-request-created.event';

type CreateServiceRequestInput = {
  customerId: string;
  serviceId: string;
  description: string;
};

@Injectable()
export class CreateServiceRequestFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter2: EventEmitter2,
  ) {}

  async execute(
    input: CreateServiceRequestInput,
  ): Promise<ServiceRequestWithProvider> {
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
        status: {
          in: [ServiceRequestStatus.PENDING, ServiceRequestStatus.ACCEPTED],
        },
      },
    });

    if (existingActive) {
      throw new ServiceRequestAlreadyExistsException();
    }

    const serviceRequest = await this.prisma.serviceRequests.create({
      data: {
        customerId: input.customerId,
        serviceId: input.serviceId,
        description: input.description,
        status: ServiceRequestStatus.PENDING,
      },
      select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
    });

    const provider = serviceRequest.service.user;
    const devices = provider.devices.map((device) => device.fcmToken);
    const providerName =
      `${provider.profile?.firstName ?? ''} ${provider.profile?.lastName ?? ''}`.trim();

    const customer = serviceRequest.user;
    const customerName =
      `${customer.profile?.firstName ?? ''} ${customer.profile?.lastName ?? ''}`.trim();

    const event = new ServiceRequestCreated(
      devices,
      providerName,
      provider.email,
      customerName,
      serviceRequest.service.title,
    );

    await this.eventEmitter2.emitAsync(ServiceRequestCreated.name, event);

    return serviceRequest;
  }
}
