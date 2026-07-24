export type UpdateServiceInput = {
  serviceId: string;
  requestingUserId: string;
  title?: string;
  description?: string;
  price?: number | null;
  pricingUnit?: string;
  keywords?: string[];
  keepImageUrls?: string[];
  newImageUrls?: string[];
};
