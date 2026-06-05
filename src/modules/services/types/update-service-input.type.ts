export type UpdateServiceInput = {
  serviceId: string;
  requestingUserId: string;
  title?: string;
  description?: string;
  price?: number;
  keywords?: string[];
};
