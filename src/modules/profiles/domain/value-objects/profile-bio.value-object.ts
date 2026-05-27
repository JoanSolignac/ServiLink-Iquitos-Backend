export class ProfileBio {
  private constructor(private readonly value: string | null) {}

  static from(value: string | null | undefined): ProfileBio {
    const normalized = value ? value.trim() : null;
    return new ProfileBio(normalized);
  }

  toPrimitives(): string | null {
    return this.value;
  }

  equals(other: ProfileBio): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
