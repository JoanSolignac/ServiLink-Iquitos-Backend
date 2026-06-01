export class PaginatedResultResponseDto<T> {
  declare data: T[];
  declare meta: {
    page: number;
    limit: number;
    total: number;
  };
}
