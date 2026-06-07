export class ServiceRequestCreated {
  constructor(
    public readonly fcmToken: string[],
    public readonly userName: string,
    public readonly userEmail: string,
    public readonly serviceTitle: string,
  ) {}
}
