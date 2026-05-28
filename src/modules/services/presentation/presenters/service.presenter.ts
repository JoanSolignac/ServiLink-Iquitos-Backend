import { Service } from '../../domain/entities/service.entity';
import { ServiceResponseDto } from '../dto/response/service.response.dto';

export function toResponseService(service: Service): ServiceResponseDto {
  return {
    id: service.getId().toPrimitives(),
    userId: service.getUserId().toPrimitives(),
    title: service.getTitle().toPrimitives(),
    description: service.getDescription().toPrimitives(),
    price: service.getPrice().toPrimitives(),
    status: service.getStatus(),
    keywords: service.getKeywords(),
    createdAt: service.getCreatedAt().toISOString(),
    updatedAt: service.getUpdatedAt().toISOString(),
  };
}

export function toResponseServiceList(
  services: Service[],
): ServiceResponseDto[] {
  return services.map(toResponseService);
}
