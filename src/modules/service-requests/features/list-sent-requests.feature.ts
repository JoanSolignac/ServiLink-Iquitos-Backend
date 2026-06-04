import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { ServiceRequestWithService } from '@modules/service-requests/utils/service-requests.util';
import { resolvePagination } from '@common/utils/pagination.util';

type ListSentRequestsInput = {
  customerId: string;
  status?: ServiceRequestStatus;
  page?: number;
  limit?: number;
};

@Injectable()
export class ListSentRequestsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListSentRequestsInput,
  ): Promise<{ data: ServiceRequestWithService[]; total: number }> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where = {
      customerId: input.customerId,
      ...(input.status && { status: input.status }),
    };

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
