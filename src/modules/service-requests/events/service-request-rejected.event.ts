export class ServiceRequestRejected {
  constructor(
    public readonly fcmTokens: string[],
    public readonly serviceTitle: string,
    public readonly rejectedByProvider: boolean,
  ) {}
}
