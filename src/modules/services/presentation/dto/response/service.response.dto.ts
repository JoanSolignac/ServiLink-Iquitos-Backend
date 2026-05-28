import { ServiceStatus } from '../../../domain/enums/service-status.enum';

export class ServiceResponseDto {
  declare id: string;
  declare userId: string;
  declare title: string;
  declare description: string;
  declare price: number;
  declare status: ServiceStatus;
  declare keywords: string[];
  declare createdAt: string;
  declare updatedAt: string;
}
