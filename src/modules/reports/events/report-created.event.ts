export class ReportCreatedEvent {
  constructor(
    public readonly reporterEmail: string,
    public readonly reporterName: string,
    public readonly moderatorEmails: Array<{ name: string; email: string }>,
    public readonly moderatorFcmTokens: string[],
  ) {}
}
