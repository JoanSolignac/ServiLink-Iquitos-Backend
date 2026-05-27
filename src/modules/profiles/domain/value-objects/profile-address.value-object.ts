export class ProfileAddress {
  private constructor(private readonly value: string | null) {}

  static from(value: string | null | undefined): ProfileAddress {
    const normalized = value ? value.trim() : null;
    return new ProfileAddress(normalized);
  }

  toPrimitives(): string | null {
    return this.value;
  }

  equals(other: ProfileAddress): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
