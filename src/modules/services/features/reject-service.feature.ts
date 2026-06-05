import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ensureServiceExistById } from '@modules/services/utils/services.util';

@Injectable()
export class RejectServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string): Promise<void> {
    await ensureServiceExistById(this.prisma, serviceId);

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { status: ServiceStatus.REJECTED },
    });
  }
}
