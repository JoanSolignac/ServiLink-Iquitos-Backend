export class ServiceRequestCreated {
  constructor(
    public readonly fcmToken: string[],
    public readonly providerName: string,
    public readonly providerEmail: string,
    public readonly customerName: string,
    public readonly serviceTitle: string,
  ) {}
}
