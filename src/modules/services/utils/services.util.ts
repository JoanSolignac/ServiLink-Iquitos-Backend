import { Service } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceNotFoundException } from '@modules/services/exceptions/service-not-found.exception';

export const ensureServiceExistById = async (
  prisma: PrismaService,
  serviceId: string,
): Promise<Service> => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new ServiceNotFoundException();
  }

  return service;
};
