import { Module } from '@nestjs/common';
import { SyncDeviceFeature } from '@modules/devices/features/sync-device.feature';
import { DevicesController } from './devices.controller';

@Module({
  providers: [SyncDeviceFeature],
  controllers: [DevicesController],
})
export class DevicesModule {}
