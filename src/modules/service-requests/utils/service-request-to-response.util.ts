import { Service, ServiceRequests } from '@prisma/client';
import { ServiceRequestResponseDto } from '@modules/service-requests/dtos/response/service-request.response.dto';

type ServiceRequestWithService = ServiceRequests & { service: Service };

export function toResponse(
  sr: ServiceRequestWithService,
): ServiceRequestResponseDto {
  return {
    id: sr.id,
    serviceId: sr.serviceId,
    customerId: sr.customerId,
    description: sr.description,
    status: sr.status,
    service: {
      title: sr.service.title,
      price: (sr.service.price as unknown as number) ?? sr.service.price,
      status: sr.service.status,
    },
    createdAt:
      sr.createdAt instanceof Date
        ? sr.createdAt.toISOString()
        : String(sr.createdAt),
    updatedAt:
      sr.updatedAt instanceof Date
        ? sr.updatedAt.toISOString()
        : String(sr.updatedAt),
  };
}
