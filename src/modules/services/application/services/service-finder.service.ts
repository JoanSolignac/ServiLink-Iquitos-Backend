import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceNotFoundException } from '../../domain/exceptions/service-not-found.exception';

@Injectable()
export class ServiceFinderService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findById(id: ServiceId): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new ServiceNotFoundException();
    }

    return service;
  }
}
