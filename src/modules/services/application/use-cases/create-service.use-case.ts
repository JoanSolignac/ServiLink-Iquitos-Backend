import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { IdGenerator } from '../../../../shared/abstractions/id-generator.abstract';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ServiceTitle } from '../../domain/value-objects/service-title.value-object';
import { ServiceDescription } from '../../domain/value-objects/service-description.value-object';
import { ServicePrice } from '../../domain/value-objects/service-price.value-object';
import { Service } from '../../domain/entities/service.entity';

export interface CreateServiceInput {
  userId: UserId;
  title: string;
  description: string;
  price: number;
  keywords: string[];
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateServiceInput): Promise<Service> {
    const serviceIdStr = this.idGenerator.generate();
    const serviceId = ServiceId.from(serviceIdStr);

    const service = Service.create(
      serviceId,
      input.userId,
      ServiceTitle.from(input.title),
      ServiceDescription.from(input.description),
      ServicePrice.from(input.price),
      input.keywords,
    );

    await this.serviceRepository.create(service);

    return service;
  }
}
