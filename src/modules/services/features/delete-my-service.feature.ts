import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ensureServiceExistById } from '@modules/services/utils/services.util';
import { ServiceUnauthorizedException } from '@modules/services/exceptions/service-unauthorized.exception';

@Injectable()
export class DeleteMyServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    serviceId: string,
  ): Promise<{ urlsToDelete: string[] }> {
    const service = await ensureServiceExistById(this.prisma, serviceId);

    if (service.userId !== userId) {
      throw new ServiceUnauthorizedException();
    }

    await this.prisma.service.delete({ where: { id: serviceId } });

    return { urlsToDelete: service.imageUrls };
  }
}
