import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import { Pagination } from '../../../../shared/value-objects/pagination.value-object';
import {
  toDomainService,
  toPersistenceService,
} from '../mappers/prisma-service.mapper';
import { ServiceNotFoundException } from '../../domain/exceptions/service-not-found.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(service: Service): Promise<void> {
    const data = toPersistenceService(service);
    await this.prisma.service.create({ data });
  }

  async update(service: Service): Promise<void> {
    const data = toPersistenceService(service);
    await this.prisma.service.update({
      where: { id: data.id },
      data,
    });
  }

  async findById(id: ServiceId): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id: id.toPrimitives() },
    });

    return service ? toDomainService(service) : null;
  }

  async findByIdOrThrow(id: ServiceId): Promise<Service> {
    const service = await this.findById(id);

    if (!service) {
      throw new ServiceNotFoundException();
    }

    return service;
  }

  async search(params: {
    search?: string;
    keywords?: string[];
    userId?: string;
    status?: ServiceStatus;
    pagination: Pagination;
  }): Promise<{ services: Service[]; total: number }> {
    const where: Prisma.ServiceWhereInput = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.keywords && params.keywords.length > 0) {
      where.keywords = {
        hasSome: params.keywords,
      };
    }

    if (params.search) {
      where.OR = [
        {
          title: {
            contains: params.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: params.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [rawServices, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.pagination.getSkip(),
        take: params.pagination.getTake(),
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      services: rawServices.map(toDomainService),
      total,
    };
  }
}
