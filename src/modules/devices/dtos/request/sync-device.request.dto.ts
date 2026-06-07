import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SyncDeviceRequestDto {
  @IsUUID()
  @IsNotEmpty()
  declare deviceId: string;

  @IsString()
  @IsNotEmpty()
  declare fcmToken: string;
}
