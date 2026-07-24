import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ensureServiceExistById } from '@modules/services/utils/services.util';

@Injectable()
export class DeleteServiceByAdminFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string): Promise<{ urlsToDelete: string[] }> {
    const service = await ensureServiceExistById(this.prisma, serviceId);

    await this.prisma.service.delete({ where: { id: serviceId } });

    return { urlsToDelete: service.imageUrls };
  }
}
