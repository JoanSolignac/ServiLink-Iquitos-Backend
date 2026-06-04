import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequests, Service } from '@prisma/client';
import { ServiceRequestNotFoundException } from '@modules/service-requests/exceptions/service-request-not-found.exception';

export type ServiceRequestWithService = ServiceRequests & { service: Service };

export const ensureServiceRequestExistsById = async (
  prisma: PrismaService,
  id: string,
): Promise<ServiceRequestWithService> => {
  const serviceRequest = await prisma.serviceRequests.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!serviceRequest) {
    throw new ServiceRequestNotFoundException();
  }

  return serviceRequest;
};
