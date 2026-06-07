export class ServiceRequestFinished {
  constructor(
    public readonly fcmTokens: string[],
    public readonly serviceTitle: string,
  ) {}
}
