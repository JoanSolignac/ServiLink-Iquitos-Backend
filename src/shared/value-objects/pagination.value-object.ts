import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

export class Pagination {
  private constructor(
    private readonly page: number,
    private readonly limit: number,
  ) {}

  static create(page?: unknown, limit?: unknown): Pagination {
    let parsedPage: number = PAGINATION_DEFAULTS.PAGE;
    let parsedLimit: number = PAGINATION_DEFAULTS.LIMIT;

    if (page !== undefined && page !== null) {
      const num = Number(page);
      if (Number.isInteger(num) && num >= 1) {
        parsedPage = num;
      }
    }

    if (limit !== undefined && limit !== null) {
      const num = Number(limit);
      if (Number.isInteger(num) && num >= 1) {
        parsedLimit = num;
      }
    }

    if (parsedLimit > PAGINATION_DEFAULTS.MAX_LIMIT) {
      parsedLimit = PAGINATION_DEFAULTS.MAX_LIMIT;
    }

    return new Pagination(parsedPage, parsedLimit);
  }

  getPage(): number {
    return this.page;
  }

  getLimit(): number {
    return this.limit;
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }

  getTake(): number {
    return this.limit;
  }
}
