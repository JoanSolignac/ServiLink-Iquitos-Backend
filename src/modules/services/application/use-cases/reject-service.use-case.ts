import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceFinderService } from '../services/service-finder.service';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class RejectServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceFinderService: ServiceFinderService,
  ) {}

  async execute(id: ServiceId): Promise<Service> {
    const service = await this.serviceFinderService.findById(id);

    service.reject();

    await this.serviceRepository.update(service);

    return service;
  }
}
