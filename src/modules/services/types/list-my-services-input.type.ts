import { ServiceStatus } from '@prisma/client';

export type ListMyServicesInput = {
  userId: string;
  search?: string;
  status?: ServiceStatus;
  page: number;
  limit: number;
};
