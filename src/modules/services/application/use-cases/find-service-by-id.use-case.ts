import { Injectable } from '@nestjs/common';
import { ServiceFinderService } from '../services/service-finder.service';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Service } from '../../domain/entities/service.entity';
import { ServiceNotFoundException } from '../../domain/exceptions/service-not-found.exception';

export interface FindServiceByIdInput {
  serviceId: ServiceId;
  requestingUserId?: UserId;
  requestingUserRole?: UserRole;
}

@Injectable()
export class FindServiceByIdUseCase {
  constructor(private readonly serviceFinderService: ServiceFinderService) {}

  async execute(input: FindServiceByIdInput): Promise<Service> {
    const service = await this.serviceFinderService.findById(input.serviceId);

    const isApproved = service.getStatus() === ServiceStatus.APPROVED;
    const isOwner =
      input.requestingUserId &&
      service.getUserId().equals(input.requestingUserId);
    const isModeratorOrAdmin =
      input.requestingUserRole === UserRole.MODERATOR ||
      input.requestingUserRole === UserRole.ADMINISTRATOR;

    if (!isApproved && !isOwner && !isModeratorOrAdmin) {
      throw new ServiceNotFoundException();
    }

    return service;
  }
}
