export type ListUsersInput = {
  page: number;
  limit: number;
  search?: string;
  excludeId: string;
};
