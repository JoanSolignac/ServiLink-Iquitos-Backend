import { ServiceTitleRequiredException } from '../exceptions/service-title-required.exception';

export class ServiceTitle {
  private constructor(private readonly value: string) {}

  static from(value: string): ServiceTitle {
    const normalized = this.normalize(value);
    this.validate(normalized);
    return new ServiceTitle(normalized);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validate(value: string): void {
    if (!value) {
      throw new ServiceTitleRequiredException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: ServiceTitle): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
