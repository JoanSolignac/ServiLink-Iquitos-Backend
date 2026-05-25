import { InvalidProviderException } from '../exceptions/invalid-provider.exception';

export class AuthProvider {
  private constructor(private readonly value: string) {}

  static from(value: string): AuthProvider {
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      throw new InvalidProviderException();
    }

    return new AuthProvider(normalized);
  }

  static fromPersistence(value: string): AuthProvider {
    return new AuthProvider(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: AuthProvider): boolean {
    return this.value === other.value;
  }
}
