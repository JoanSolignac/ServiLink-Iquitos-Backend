export class ServiceCreatedEvent {
  constructor(
    public readonly userName: string,
    public readonly userEmail: string,
    public readonly serviceTitle: string,
  ) {}
}
