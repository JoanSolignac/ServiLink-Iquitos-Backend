import { PrismaService } from '@prisma/prisma.service';
import { ServiceRequestNotFoundException } from '@modules/service-requests/exceptions/service-request-not-found.exception';
import {
  SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
  ServiceRequestWithCustomer,
} from '@modules/service-requests/types/service-request-with-customer.type';
import {
  SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  ServiceRequestWithProvider,
} from '@modules/service-requests/types/service-request-with-provider.type';

export const ensureServiceRequestWithCustomer = async (
  prisma: PrismaService,
  id: string,
): Promise<ServiceRequestWithCustomer> => {
  const serviceRequest = await prisma.serviceRequests.findUnique({
    where: { id },
    select: SERVICE_REQUEST_WITH_CUSTOMER_SELECT,
  });

  if (!serviceRequest) {
    throw new ServiceRequestNotFoundException();
  }

  return serviceRequest;
};

export const ensureServiceRequestWithProvider = async (
  prisma: PrismaService,
  id: string,
): Promise<ServiceRequestWithProvider> => {
  const serviceRequest = await prisma.serviceRequests.findUnique({
    where: { id },
    select: SERVICE_REQUEST_WITH_PROVIDER_SELECT,
  });

  if (!serviceRequest) {
    throw new ServiceRequestNotFoundException();
  }

  return serviceRequest;
};
