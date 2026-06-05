import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ensureServiceExistById } from '@modules/services/utils/services.util';
import { ServiceAlreadyApprovedException } from '@modules/services/exceptions/service-already-approved.exception';

@Injectable()
export class ApproveServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string): Promise<void> {
    const existing = await ensureServiceExistById(this.prisma, serviceId);

    if (existing.status === ServiceStatus.APPROVED) {
      throw new ServiceAlreadyApprovedException();
    }

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { status: ServiceStatus.APPROVED },
    });
  }
}
