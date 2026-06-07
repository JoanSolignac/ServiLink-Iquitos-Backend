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

    const user = serviceRequest.service.user;
    const profile = user.profile;
    const devices = user.devices.map((device) => device.fcmToken);

    const userName =
      `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();

    const event = new ServiceRequestCreated(
      devices,
      userName,
      user.email,
      serviceRequest.service.title,
    );

    await this.eventEmitter2.emitAsync(ServiceRequestCreated.name, event);

    return serviceRequest;
  }
}
