import { Service as PrismaServiceDb } from '@prisma/client';
import { Service } from '../../domain/entities/service.entity';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ServiceTitle } from '../../domain/value-objects/service-title.value-object';
import { ServiceDescription } from '../../domain/value-objects/service-description.value-object';
import { ServicePrice } from '../../domain/value-objects/service-price.value-object';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Prisma } from '@prisma/client';

export function toDomainService(raw: PrismaServiceDb): Service {
  return Service.fromPersistence(
    ServiceId.from(raw.id),
    UserId.from(raw.userId),
    ServiceTitle.from(raw.title),
    ServiceDescription.from(raw.description),
    ServicePrice.from(raw.price.toNumber()),
    raw.status as ServiceStatus,
    raw.keywords,
    raw.createdAt,
    raw.updatedAt,
  );
}

export function toPersistenceService(service: Service): PrismaServiceDb {
  return {
    id: service.getId().toPrimitives(),
    userId: service.getUserId().toPrimitives(),
    title: service.getTitle().toPrimitives(),
    description: service.getDescription().toPrimitives(),
    price: new Prisma.Decimal(service.getPrice().toPrimitives()),
    status: service.getStatus(),
    keywords: service.getKeywords(),
    createdAt: service.getCreatedAt(),
    updatedAt: service.getUpdatedAt(),
  };
}
