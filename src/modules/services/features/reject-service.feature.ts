import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Service } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';

@Injectable()
export class RejectServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string): Promise<Service> {
    const existing = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      throw new ServiceNotFoundException();
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: { status: 'REJECTED' },
    });
  }
}
