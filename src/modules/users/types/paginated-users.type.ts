import { UserWithProfile } from './user-with-profile.type';

export type PaginatedUsers = {
  users: UserWithProfile[];
  total: number;
};
