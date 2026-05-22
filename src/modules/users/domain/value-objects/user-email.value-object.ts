import { UserEmailRequiredException } from '../exceptions/user-email-required.exception';
import { UserEmailInvalidFormatException } from '../exceptions/user-email-invalid-format.exception';

export class UserEmail {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly email: string) {}

  static from(value: string): UserEmail {
    const email = this.normalize(value);
    this.validateRequired(email);
    this.validateFormat(email);
    return new UserEmail(email);
  }

  private static normalize(value: string): string {
    return value ? value.trim().toLowerCase() : '';
  }

  private static validateRequired(value: string): void {
    if (!value) {
      throw new UserEmailRequiredException();
    }
  }

  private static validateFormat(value: string): void {
    if (!UserEmail.EMAIL_REGEX.test(value)) {
      throw new UserEmailInvalidFormatException();
    }
  }

  toPrimitives(): string {
    return this.email;
  }

  equals(other: UserEmail): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
