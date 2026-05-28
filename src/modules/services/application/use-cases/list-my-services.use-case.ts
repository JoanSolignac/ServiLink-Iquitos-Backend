import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { Service } from '../../domain/entities/service.entity';

export interface ListMyServicesInput {
  search?: string;
  keywords?: string[];
  status?: ServiceStatus;
  pagination: Pagination;
  requestingUserId: UserId;
}

@Injectable()
export class ListMyServicesUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(
    input: ListMyServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
    return this.serviceRepository.search({
      search: input.search,
      keywords: input.keywords,
      userId: input.requestingUserId.toPrimitives(),
      status: input.status,
      pagination: input.pagination,
    });
  }
}
