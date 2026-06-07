import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SyncDeviceInput } from '@modules/devices/types/sync-device-input.type';
import { ensureUserExistsByEmail } from '@common/utils/utils/user.util';

@Injectable()
export class SyncDeviceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: SyncDeviceInput): Promise<void> {
    const user = await ensureUserExistsByEmail(this.prisma, input.userEmail);

    const now = new Date();

    await this.prisma.device.upsert({
      where: { id: input.deviceId },
      create: {
        id: input.deviceId,
        userId: user.id,
        fcmToken: input.fcmToken,
        lastSeenAt: now,
      },
      update: {
        userId: user.id,
        lastSeenAt: now,
      },
    });
  }
}
