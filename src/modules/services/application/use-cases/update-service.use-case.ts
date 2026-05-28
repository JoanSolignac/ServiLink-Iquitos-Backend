import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceFinderService } from '../services/service-finder.service';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ServiceTitle } from '../../domain/value-objects/service-title.value-object';
import { ServiceDescription } from '../../domain/value-objects/service-description.value-object';
import { ServicePrice } from '../../domain/value-objects/service-price.value-object';
import { ServiceUnauthorizedException } from '../../domain/exceptions/service-unauthorized.exception';
import { Service } from '../../domain/entities/service.entity';

export interface UpdateServiceInput {
  serviceId: ServiceId;
  requestingUserId: UserId;
  title?: string;
  description?: string;
  price?: number;
  keywords?: string[];
}

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceFinderService: ServiceFinderService,
  ) {}

  async execute(input: UpdateServiceInput): Promise<Service> {
    const service = await this.serviceFinderService.findById(input.serviceId);

    if (!service.getUserId().equals(input.requestingUserId)) {
      throw new ServiceUnauthorizedException();
    }

    const title =
      input.title !== undefined
        ? ServiceTitle.from(input.title)
        : service.getTitle();
    const description =
      input.description !== undefined
        ? ServiceDescription.from(input.description)
        : service.getDescription();
    const price =
      input.price !== undefined
        ? ServicePrice.from(input.price)
        : service.getPrice();
    const keywords =
      input.keywords !== undefined ? input.keywords : service.getKeywords();

    service.updateInfo(title, description, price, keywords);

    await this.serviceRepository.update(service);

    return service;
  }
}
