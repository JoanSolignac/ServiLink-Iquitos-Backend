import { Body, Controller, Post } from '@nestjs/common';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { SyncDeviceFeature } from '@modules/devices/features/sync-device.feature';
import { SyncDeviceRequestDto } from '@modules/devices/dtos/request/sync-device.request.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';

@UseAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly syncDeviceFeature: SyncDeviceFeature) {}

  @Post('sync')
  async sync(
    @CurrentUser() currentUser: AuthCurrentUser,
    @Body() body: SyncDeviceRequestDto,
  ): Promise<void> {
    await this.syncDeviceFeature.execute({
      deviceId: body.deviceId,
      userEmail: currentUser.email,
      fcmToken: body.fcmToken,
    });
  }
}
