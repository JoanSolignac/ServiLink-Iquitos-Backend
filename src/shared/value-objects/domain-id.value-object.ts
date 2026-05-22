import { DomainIdRequiredException } from '../exceptions/domain-id-required.exception';
import { DomainIdInvalidFormatException } from '../exceptions/domain-id-invalid-format.exception';

export abstract class DomainId {
  private static readonly UUID_V7_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  protected constructor(private readonly value: string) {}

  protected static validate(value: string): string {
    const normalizedValue = value ? value.trim() : '';

    if (!normalizedValue) {
      throw new DomainIdRequiredException();
    }

    if (!DomainId.UUID_V7_REGEX.test(normalizedValue)) {
      throw new DomainIdInvalidFormatException();
    }

    return normalizedValue;
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: DomainId): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
