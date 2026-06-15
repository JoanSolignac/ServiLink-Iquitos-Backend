export class ServiceRequestCancelled {
  constructor(
    public readonly fcmTokens: string[],
    public readonly userEmail: string,
    public readonly userName: string,
    public readonly serviceTitle: string,
    public readonly cancelledByCustomer: boolean,
  ) {}
}
