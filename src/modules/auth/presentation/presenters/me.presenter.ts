import { AuthCurrentUser } from '../../domain/interfaces/auth-current-user.interface';
import { MeResponseDto } from '../dto/response/me.response.dto';

export function toResponseMe(authCurrentUser: AuthCurrentUser): MeResponseDto {
  return {
    id: authCurrentUser.id.toPrimitives(),
    role: authCurrentUser.role,
    email: authCurrentUser.email.toPrimitives(),
  };
}
