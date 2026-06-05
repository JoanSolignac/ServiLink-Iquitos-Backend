import { ServiceRequestWithCustomer } from '@modules/service-requests/types/service-request-with-customer.type';
import { ServiceRequestWithProvider } from '@modules/service-requests/types/service-request-with-provider.type';
import { ReceivedServiceRequestResponseDto } from '@modules/service-requests/dtos/response/received-service-request.response.dto';
import { SentServiceRequestResponseDto } from '@modules/service-requests/dtos/response/sent-service-request.response.dto';

export function toReceivedResponse(
  sr: ServiceRequestWithCustomer,
): ReceivedServiceRequestResponseDto {
  return {
    id: sr.id,
    serviceId: sr.serviceId,
    customerId: sr.customerId,
    description: sr.description,
    status: sr.status,
    service: {
      title: sr.service.title,
      price: sr.service.price.toNumber(),
      status: sr.service.status,
    },
    customer: {
      firstName: sr.user.profile?.firstName ?? '',
      lastName: sr.user.profile?.lastName ?? '',
      pictureProfileUrl: sr.user.profile?.profilePictureUrl ?? undefined,
    },
    createdAt: sr.createdAt.toISOString(),
    updatedAt: sr.updatedAt.toISOString(),
  };
}

export function toSentResponse(
  sr: ServiceRequestWithProvider,
): SentServiceRequestResponseDto {
  return {
    id: sr.id,
    serviceId: sr.serviceId,
    customerId: sr.customerId,
    description: sr.description,
    status: sr.status,
    service: {
      title: sr.service.title,
      price: sr.service.price.toNumber(),
      status: sr.service.status,
    },
    provider: {
      firstName: sr.service.user.profile?.firstName ?? '',
      lastName: sr.service.user.profile?.lastName ?? '',
      pictureProfileUrl:
        sr.service.user.profile?.profilePictureUrl ?? undefined,
    },
    createdAt: sr.createdAt.toISOString(),
    updatedAt: sr.updatedAt.toISOString(),
  };
}
