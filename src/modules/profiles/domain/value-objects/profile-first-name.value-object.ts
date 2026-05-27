import { ProfileFirstNameRequiredException } from '../exceptions/profile-first-name-required.exception';

export class ProfileFirstName {
  private constructor(private readonly value: string) {}

  static from(value: string): ProfileFirstName {
    const normalized = this.normalize(value);
    this.validate(normalized);
    return new ProfileFirstName(normalized);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validate(value: string): void {
    if (!value) {
      throw new ProfileFirstNameRequiredException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: ProfileFirstName): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
