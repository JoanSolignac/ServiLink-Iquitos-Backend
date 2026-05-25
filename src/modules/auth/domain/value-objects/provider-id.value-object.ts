export class ProviderId {
  private constructor(private readonly value: string) {}

  static from(value: string): ProviderId {
    const normalizedValue = ProviderId.normalize(value);
    return new ProviderId(normalizedValue);
  }

  private static normalize(value: string): string {
    return value ? value.trim() : '';
  }

  toPrimitives(): string {
    return this.value;
  }

  equals(other: ProviderId): boolean {
    return this.toPrimitives() === other.toPrimitives();
  }
}
