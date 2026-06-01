import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Service } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';
import { ServiceUnauthorizedException } from '../exceptions/service-unauthorized.exception';

type UpdateServiceInput = {
  serviceId: string;
  requestingUserId: string;
  title?: string;
  description?: string;
  price?: number;
  keywords?: string[];
};

@Injectable()
export class UpdateServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: UpdateServiceInput): Promise<Service> {
    const existing = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!existing) {
      throw new ServiceNotFoundException();
    }

    if (existing.userId !== input.requestingUserId) {
      throw new ServiceUnauthorizedException();
    }

    return this.prisma.service.update({
      where: { id: input.serviceId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        keywords: input.keywords,
        status: 'REQUIRE_REVIEW',
      },
    });
  }
}
