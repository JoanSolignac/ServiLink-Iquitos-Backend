export class RatingCreated {
  constructor(
    public readonly fcmTokens: string[],
    public readonly providerEmail: string,
    public readonly providerName: string,
    public readonly serviceTitle: string,
    public readonly score: number,
  ) {}
}
