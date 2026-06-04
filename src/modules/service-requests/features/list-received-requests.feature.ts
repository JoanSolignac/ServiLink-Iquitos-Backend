import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma, ServiceRequestStatus } from '@prisma/client';
import { ServiceRequestWithService } from '@modules/service-requests/utils/service-requests.util';
import { resolvePagination } from '@common/utils/pagination.util';

import { ensureUserExistsById } from '@common/utils/ensureUserExistsById.utils';

type ListReceivedRequestsInput = {
  actorId: string;
  status?: ServiceRequestStatus;
  page?: number;
  limit?: number;
};

@Injectable()
export class ListReceivedRequestsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListReceivedRequestsInput,
  ): Promise<{ data: ServiceRequestWithService[]; total: number }> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const user = await ensureUserExistsById(this.prisma, input.actorId);

    const where: Prisma.ServiceRequestsWhereInput = {
      service: { userId: user.id },
    };

    if (input.status) {
      where.status = input.status;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.serviceRequests.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.serviceRequests.count({ where }),
    ]);

    return { data, total };
  }
}
