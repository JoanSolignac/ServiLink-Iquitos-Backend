import { DomainIdRequiredException } from '../exceptions/domain-id-required.exception';
import { DomainIdInvalidFormatException } from '../exceptions/domain-id-invalid-format.exception';

export class DomainId {
  private static readonly UUID_V7_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  protected constructor(private readonly value: string) {}

  static from<T extends DomainId>(
    this: new (value: string) => T,
    value: string,
  ): T {
    const normalizedValue = DomainId.normalize(value);
    DomainId.validateRequired(normalizedValue);
    DomainId.validateFormat(normalizedValue);
    return new this(normalizedValue);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validateRequired(value: string): void {
    if (!value) {
      throw new DomainIdRequiredException();
    }
  }

  private static validateFormat(value: string): void {
    if (!DomainId.UUID_V7_REGEX.test(value)) {
      throw new DomainIdInvalidFormatException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: DomainId): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
