import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus, UserRole } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';
import { FindServiceByIdInput } from '@modules/services/types/find-service-by-id-input.type';
import {
  ServiceWithProfile,
  SERVICE_WITH_PROFILE_SELECT,
} from '@modules/services/types/service-with-profile.type';

@Injectable()
export class FindServiceByIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: FindServiceByIdInput): Promise<ServiceWithProfile> {
    const service = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
      select: SERVICE_WITH_PROFILE_SELECT,
    });

    if (!service) {
      throw new ServiceNotFoundException();
    }

    const isApproved = service.status === ServiceStatus.APPROVED;

    const isOwner =
      input.requestingUserId && service.user.id === input.requestingUserId;

    const isModeratorOrAdmin =
      input.requestingUserRole === UserRole.MODERATOR ||
      input.requestingUserRole === UserRole.ADMINISTRATOR;

    if (!isApproved && !isOwner && !isModeratorOrAdmin) {
      throw new ServiceNotFoundException();
    }

    return service;
  }
}
