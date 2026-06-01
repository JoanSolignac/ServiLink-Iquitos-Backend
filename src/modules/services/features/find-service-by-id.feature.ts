import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Service, ServiceStatus, UserRole } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';

type FindServiceByIdInput = {
  serviceId: string;
  requestingUserId?: string;
  requestingUserRole?: UserRole;
};

@Injectable()
export class FindServiceByIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: FindServiceByIdInput): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!service) {
      throw new ServiceNotFoundException();
    }

    const isApproved = service.status === ServiceStatus.APPROVED;

    const isOwner =
      input.requestingUserId && service.userId === input.requestingUserId;

    const isModeratorOrAdmin =
      input.requestingUserRole === UserRole.MODERATOR ||
      input.requestingUserRole === UserRole.ADMINISTRATOR;

    if (!isApproved && !isOwner && !isModeratorOrAdmin) {
      throw new ServiceNotFoundException();
    }

    return service;
  }
}
