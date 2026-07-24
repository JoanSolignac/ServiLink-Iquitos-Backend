export class ReportReviewedEvent {
  constructor(
    public readonly reporterEmail: string,
    public readonly reporterName: string,
  ) {}
}
