import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestNotFoundException } from '@modules/service-requests/exceptions/service-request-not-found.exception';
import { ServiceRequestUnauthorizedException } from '@modules/service-requests/exceptions/service-request-unauthorized.exception';
import {
  SERVICE_REQUEST_DETAIL_SELECT,
  ServiceRequestDetail,
} from '@modules/service-requests/types/service-request-detail.type';

@Injectable()
export class GetServiceRequestByIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, actorId: string): Promise<ServiceRequestDetail> {
    const serviceRequest = await this.prisma.serviceRequests.findUnique({
      where: { id },
      select: SERVICE_REQUEST_DETAIL_SELECT,
    });

    if (!serviceRequest) {
      throw new ServiceRequestNotFoundException();
    }

    const isCustomer = actorId === serviceRequest.customerId;
    const isProvider = actorId === serviceRequest.service.userId;

    if (!isCustomer && !isProvider) {
      throw new ServiceRequestUnauthorizedException();
    }

    return serviceRequest;
  }
}
