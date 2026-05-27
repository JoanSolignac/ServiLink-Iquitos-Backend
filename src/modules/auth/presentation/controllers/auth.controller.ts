import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import type { AuthCurrentUser } from '../../domain/interfaces/auth-current-user.interface';
import { UseAuth } from '../../infrastructure/security/decorators/use-auth.decorator';
import { toResponseMe } from '../presenters/me.presenter';
import { MeResponseDto } from '../dto/response/me.response.dto';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseAuth()
  me(@CurrentUser() authCurrentUser: AuthCurrentUser): MeResponseDto {
    return toResponseMe(authCurrentUser);
  }
}
