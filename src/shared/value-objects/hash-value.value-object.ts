import { HashRequiredException } from '../exceptions/hash-required.exception';
import { HashExceedsMaxLengthException } from '../exceptions/hash-exceeds-max-length.exception';
import { HashInvalidFormatException } from '../exceptions/hash-invalid-format.exception';

export abstract class HashedValue {
  private static readonly HASH_REGEX = /^\$argon2(id|i|d)\$.*$/;

  protected constructor(private readonly value: string) {}

  protected static validate(value: string): string {
    const normalizedValue = HashedValue.normalize(value);

    HashedValue.validateRequired(normalizedValue);
    HashedValue.validateLength(normalizedValue);
    HashedValue.validateFormat(normalizedValue);

    return normalizedValue;
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validateRequired(value: string): void {
    if (!value) {
      throw new HashRequiredException();
    }
  }

  private static validateLength(value: string): void {
    if (value.length > 255) {
      throw new HashExceedsMaxLengthException();
    }
  }

  private static validateFormat(value: string): void {
    if (!HashedValue.HASH_REGEX.test(value)) {
      throw new HashInvalidFormatException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: HashedValue): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
