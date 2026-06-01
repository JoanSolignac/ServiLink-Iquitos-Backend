import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Service, Prisma, ServiceStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';

type ListMyServicesInput = {
  userId: string;
  search?: string;
  status?: ServiceStatus;
  page: number;
  limit: number;
};

@Injectable()
export class ListMyServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListMyServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.ServiceWhereInput = {
      userId: input.userId,
    };

    if (input.status) {
      where.status = input.status;
    }

    if (input.search) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          keywords: {
            has: input.search,
          },
        },
      ];
    }

    const [services, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { services, total };
  }
}
