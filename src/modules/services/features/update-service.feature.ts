import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';
import { ServiceUnauthorizedException } from '../exceptions/service-unauthorized.exception';
import { UpdateServiceInput } from '../types/update-service-input.type';

@Injectable()
export class UpdateServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: UpdateServiceInput): Promise<void> {
    const existing = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!existing) {
      throw new ServiceNotFoundException();
    }

    if (existing.userId !== input.requestingUserId) {
      throw new ServiceUnauthorizedException();
    }

    await this.prisma.service.update({
      where: { id: input.serviceId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        pricingUnit: input.pricingUnit,
        keywords: input.keywords,
        status: ServiceStatus.REQUIRE_REVIEW,
      },
    });
  }
}
