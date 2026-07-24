export class ServiceDisabledEvent {
  constructor(
    public readonly userEmail: string,
    public readonly userName: string,
    public readonly serviceTitle: string,
    public readonly disabledUntil: Date | null,
  ) {}
}
