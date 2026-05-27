import { Profile } from '../../domain/entities/profile.entity';
import { ProfileResponseDto } from '../dto/response/profile.response.dto';

export function toResponseProfile(profile: Profile): ProfileResponseDto {
  return {
    userId: profile.getUserId().toPrimitives(),
    firstName: profile.getFirstName().toPrimitives(),
    lastName: profile.getLastName().toPrimitives(),
    birthDate: profile.getBirthDate().toPrimitives(),
    profilePictureUrl: profile.getPictureUrl().toPrimitives(),
    bio: profile.getBio().toPrimitives(),
    phone: profile.getPhone().toPrimitives(),
    address: profile.getAddress().toPrimitives(),
    createdAt: profile.getCreatedAt(),
    updatedAt: profile.getUpdatedAt(),
  };
}
