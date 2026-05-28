import { ServiceDescriptionRequiredException } from '../exceptions/service-description-required.exception';

export class ServiceDescription {
  private constructor(private readonly value: string) {}

  static from(value: string): ServiceDescription {
    const normalized = this.normalize(value);
    this.validate(normalized);
    return new ServiceDescription(normalized);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validate(value: string): void {
    if (!value) {
      throw new ServiceDescriptionRequiredException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: ServiceDescription): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
