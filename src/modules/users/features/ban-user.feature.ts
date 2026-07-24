import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus, UserStatus } from '@prisma/client';
import { ensureUserExistsById } from '@common/utils/ensureUserExistsById.utils';
import { normalizeToNextHour } from '@common/utils/normalize-to-next-hour.util';
import { UserAlreadySuspendedException } from '../exceptions/user-already-suspended.exception';
import { UserBannedEvent } from '../events/user-banned.event';

export interface BanUserInput {
  userId: string;
  bannedUntil: Date | null;
}

export interface BanUserResult {
  id: string;
  status: UserStatus;
  bannedUntil: Date | null;
}

@Injectable()
export class BanUserFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: BanUserInput): Promise<BanUserResult> {
    const user = await ensureUserExistsById(this.prisma, input.userId);

    if (user.status === UserStatus.SUSPENDED) {
      throw new UserAlreadySuspendedException();
    }

    const bannedUntil =
      input.bannedUntil !== null
        ? normalizeToNextHour(input.bannedUntil)
        : null;

    const [updatedUser] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: input.userId },
        data: { status: UserStatus.SUSPENDED, bannedUntil },
        select: { id: true, status: true, bannedUntil: true },
      }),
      this.prisma.service.updateMany({
        where: { userId: input.userId, status: ServiceStatus.APPROVED },
        data: { status: ServiceStatus.DISABLED, disabledUntil: null },
      }),
    ]);

    const profile = await this.prisma.profile.findUnique({
      where: { userId: input.userId },
      select: { firstName: true, lastName: true },
    });

    const userName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : user.email;

    this.eventEmitter.emit(
      UserBannedEvent.name,
      new UserBannedEvent(user.email, userName, bannedUntil),
    );

    return updatedUser;
  }
}
