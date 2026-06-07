export class ServiceRequestAccepted {
  constructor(
    public readonly fcmTokens: string[],
    public readonly serviceTitle: string,
  ) {}
}
