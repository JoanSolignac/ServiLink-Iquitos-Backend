import { MyService } from './my-service.type';

export type PaginatedMyServices = {
  myServices: MyService[];
  total: number;
};
