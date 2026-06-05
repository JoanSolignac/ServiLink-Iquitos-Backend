import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';
import {
  SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  ServiceRequestWithProvider,
} from '@modules/service-requests/types/service-request-with-provider.type';

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
  ): Promise<{ data: ServiceRequestWithProvider[]; total: number }> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where = {
      customerId: input.customerId,
      ...(input.status && { status: input.status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.serviceRequests.findMany({
        where,
        select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.serviceRequests.count({ where }),
    ]);

    return { data, total };
  }
}
