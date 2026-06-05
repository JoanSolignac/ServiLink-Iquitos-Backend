import { ServiceWithProfile } from './service-with-profile.type';

export type PaginatedServicesWithProfile = {
  servicesUserProfile: ServiceWithProfile[];
  total: number;
};
