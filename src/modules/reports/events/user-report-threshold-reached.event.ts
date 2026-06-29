export class UserReportThresholdReachedEvent {
  constructor(
    public readonly targetUserEmail: string,
    public readonly targetUserName: string,
  ) {}
}
