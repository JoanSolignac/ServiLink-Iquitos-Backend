export class ServiceRequestConfirmed {
  constructor(
    public readonly fcmTokens: string[],
    public readonly serviceTitle: string,
  ) {}
}
