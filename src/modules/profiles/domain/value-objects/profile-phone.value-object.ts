export class ProfilePhone {
  private constructor(private readonly value: string | null) {}

  static from(value: string | null | undefined): ProfilePhone {
    const normalized = value ? value.trim() : null;
    return new ProfilePhone(normalized);
  }

  toPrimitives(): string | null {
    return this.value;
  }

  equals(other: ProfilePhone): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
