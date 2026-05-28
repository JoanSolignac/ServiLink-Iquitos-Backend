export class PaginatedResponseDto<T> {
  declare data: T[];
  declare meta: {
    page: number;
    limit: number;
    total: number;
  };
}
