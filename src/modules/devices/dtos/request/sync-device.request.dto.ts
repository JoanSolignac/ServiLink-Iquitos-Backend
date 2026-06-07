import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SyncDeviceRequestDto {
  @ApiProperty({
    description:
      'Identificador único del dispositivo (UUID generado por el cliente)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  declare deviceId: string;

  @ApiProperty({
    description:
      'Token FCM (Firebase Cloud Messaging) del dispositivo para recibir notificaciones push',
    example: 'fY3k9xZ2mNp:APA91bHq...',
  })
  @IsString()
  @IsNotEmpty()
  declare fcmToken: string;
}
