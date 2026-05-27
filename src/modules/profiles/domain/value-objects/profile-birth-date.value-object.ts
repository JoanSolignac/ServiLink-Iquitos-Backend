import { ProfileBirthDateRequiredException } from '../exceptions/profile-birth-date-required.exception';
import { ProfileBirthDateInvalidException } from '../exceptions/profile-birth-date-invalid.exception';

export class ProfileBirthDate {
  private constructor(private readonly value: Date) {}

  static from(value: Date): ProfileBirthDate {
    if (!value) {
      throw new ProfileBirthDateRequiredException();
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new ProfileBirthDateInvalidException();
    }

    return new ProfileBirthDate(date);
  }

  toPrimitives(): Date {
    return this.value;
  }

  equals(other: ProfileBirthDate): boolean {
    return this.toPrimitives().getTime() === other.toPrimitives().getTime();
  }
}
