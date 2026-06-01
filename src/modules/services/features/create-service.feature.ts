import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Service, ServiceStatus } from '@prisma/client';

@Injectable()
export class CreateServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    title: string,
    description: string,
    price: number,
    keywords: string[],
  ): Promise<Service> {
    return this.prisma.service.create({
      data: {
        userId,
        title,
        description,
        price,
        keywords,
        status: ServiceStatus.REQUIRE_REVIEW,
      },
    });
  }
}
