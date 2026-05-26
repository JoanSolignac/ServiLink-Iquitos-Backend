import { Controller, Get, Logger } from '@nestjs/common';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import type { AuthCurrentUser } from '../../domain/interfaces/auth-current-user.interface';
import { UseAuth } from '../../infrastructure/security/decorators/use-auth.decorator';
import { toResponseMe } from '../presenters/me.presenter';
import { MeResponseDto } from '../dto/response/me.response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('me')
  @UseAuth()
  me(@CurrentUser() authCurrentUser: AuthCurrentUser): MeResponseDto {
    this.logger.log(
      `AuthController.me input: id=${authCurrentUser.id.toPrimitives()}, email=${authCurrentUser.email.toPrimitives()}, role=${authCurrentUser.role}`,
    );

    const response = toResponseMe(authCurrentUser);

    this.logger.log(`AuthController.me output: ${JSON.stringify(response)}`);

    return response;
  }
}
