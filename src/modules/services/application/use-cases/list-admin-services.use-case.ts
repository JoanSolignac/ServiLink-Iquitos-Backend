import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';
import { Service } from '../../domain/entities/service.entity';

export interface ListAdminServicesInput {
  search?: string;
  keywords?: string[];
  userId?: string;
  status?: ServiceStatus;
  pagination: Pagination;
}

@Injectable()
export class ListAdminServicesUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(
    input: ListAdminServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
    return this.serviceRepository.search({
      search: input.search,
      keywords: input.keywords,
      userId: input.userId,
      status: input.status,
      pagination: input.pagination,
    });
  }
}
