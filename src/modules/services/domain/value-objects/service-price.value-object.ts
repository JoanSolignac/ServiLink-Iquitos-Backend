import { ServicePriceInvalidException } from '../exceptions/service-price-invalid.exception';

export class ServicePrice {
  private constructor(private readonly value: number) {}

  static from(value: number): ServicePrice {
    this.validate(value);
    return new ServicePrice(value);
  }

  private static validate(value: number): void {
    if (value === undefined || value === null || isNaN(value) || value < 0) {
      throw new ServicePriceInvalidException();
    }
  }

  toPrimitives(): number {
    return this.value;
  }

  equals(other: ServicePrice): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
