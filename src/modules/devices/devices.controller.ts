import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { SyncDeviceFeature } from '@modules/devices/features/sync-device.feature';
import { SyncDeviceRequestDto } from '@modules/devices/dtos/request/sync-device.request.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';

@ApiTags('Devices')
@ApiBearerAuth('bearer')
@UseAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly syncDeviceFeature: SyncDeviceFeature) {}

  @Post('sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Sync device FCM token',
    description:
      'Registra o actualiza el token FCM del dispositivo del usuario autenticado. ' +
      'Debe llamarse al iniciar la app y cada vez que Firebase renueve el token.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Token registrado correctamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos del dispositivo inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT ausente o inválido',
  })
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
