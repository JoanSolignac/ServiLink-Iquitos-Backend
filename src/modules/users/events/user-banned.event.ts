export class UserBannedEvent {
  constructor(
    public readonly userEmail: string,
    public readonly userName: string,
    public readonly bannedUntil: Date | null,
  ) {}
}
