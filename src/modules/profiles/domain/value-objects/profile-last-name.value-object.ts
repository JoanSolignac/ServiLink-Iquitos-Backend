import { ProfileLastNameRequiredException } from '../exceptions/profile-last-name-required.exception';

export class ProfileLastName {
  private constructor(private readonly value: string) {}

  static from(value: string): ProfileLastName {
    const normalized = this.normalize(value);
    this.validate(normalized);
    return new ProfileLastName(normalized);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  private static validate(value: string): void {
    if (!value) {
      throw new ProfileLastNameRequiredException();
    }
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: ProfileLastName): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
