export class ProfilePictureUrl {
  private constructor(private readonly value: string | null) {}

  static from(value: string | null | undefined): ProfilePictureUrl {
    const normalized = value ? value.trim() : null;
    return new ProfilePictureUrl(normalized);
  }

  toPrimitives(): string | null {
    return this.value;
  }

  equals(other: ProfilePictureUrl): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
