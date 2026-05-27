import { Controller, Get, Logger } from '@nestjs/common';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import type { AuthCurrentUser } from '../../domain/interfaces/auth-current-user.interface';
import { UseAuth } from '../../infrastructure/security/decorators/use-auth.decorator';
import { toResponseMe } from '../presenters/me.presenter';
import { MeResponseDto } from '../dto/response/me.response.dto';
import { ProfileRepository } from '../../../profiles/domain/repositories/profile.repository';

@Controller('auth')
export class AuthController {
  constructor(private readonly profileRepository: ProfileRepository) {}

  @Get('me')
  @UseAuth()
  me(@CurrentUser() authCurrentUser: AuthCurrentUser): MeResponseDto {
    this.logger.log(
      `AuthController.me input: id=${authCurrentUser.id.toPrimitives()}, email=${authCurrentUser.email.toPrimitives()}, role=${authCurrentUser.role}`,
    );

    return toResponseMe(authCurrentUser);
  }
}
