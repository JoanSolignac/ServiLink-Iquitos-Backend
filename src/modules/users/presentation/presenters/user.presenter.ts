import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/response/user.response.dto';

export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.getId().toPrimitives(),
    email: user.getEmail().toPrimitives(),
    role: user.getRole(),
    status: user.getStatus(),
    createdAt: user.getCreatedAt(),
    updatedAt: user.getUpdatedAt(),
  };
}
