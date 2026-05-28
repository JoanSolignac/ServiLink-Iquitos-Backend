import { Service } from '../entities/service.entity';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ServiceStatus } from '../enums/service-status.enum';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';

export abstract class ServiceRepository {
  abstract create(service: Service): Promise<void>;
  abstract update(service: Service): Promise<void>;
  abstract findById(id: ServiceId): Promise<Service | null>;
  abstract findByIdOrThrow(id: ServiceId): Promise<Service>;
  abstract search(params: {
    search?: string;
    keywords?: string[];
    userId?: string;
    status?: ServiceStatus;
    pagination: Pagination;
  }): Promise<{ services: Service[]; total: number }>;
}
