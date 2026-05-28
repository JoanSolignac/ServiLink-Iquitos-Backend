import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';
import { Service } from '../../domain/entities/service.entity';

export interface ListPublicServicesInput {
  search?: string;
  keywords?: string[];
  pagination: Pagination;
}

@Injectable()
export class ListPublicServicesUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(
    input: ListPublicServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
    return this.serviceRepository.search({
      search: input.search,
      keywords: input.keywords,
      status: ServiceStatus.APPROVED,
      pagination: input.pagination,
    });
  }
}
