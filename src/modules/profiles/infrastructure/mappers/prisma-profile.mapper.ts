import { Profile as PrismaProfile } from '@prisma/client';
import { Profile } from '../../domain/entities/profile.entity';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ProfileFirstName } from '../../domain/value-objects/profile-first-name.value-object';
import { ProfileLastName } from '../../domain/value-objects/profile-last-name.value-object';
import { ProfileBirthDate } from '../../domain/value-objects/profile-birth-date.value-object';
import { ProfilePhone } from '../../domain/value-objects/profile-phone.value-object';
import { ProfileAddress } from '../../domain/value-objects/profile-address.value-object';
import { ProfileBio } from '../../domain/value-objects/profile-bio.value-object';
import { ProfilePictureUrl } from '../../domain/value-objects/profile-picture-url.value-object';

export function toDomainProfile(profile: PrismaProfile): Profile {
  return Profile.fromPersistence(
    UserId.from(profile.userId),
    ProfileFirstName.from(profile.firstName),
    ProfileLastName.from(profile.lastName),
    ProfileBirthDate.from(profile.birthDate),
    ProfilePhone.from(profile.phone),
    ProfileAddress.from(profile.address),
    ProfileBio.from(profile.bio),
    ProfilePictureUrl.from(profile.profilePictureUrl),
    profile.createdAt,
    profile.updatedAt,
  );
}

export function toPersistenceProfile(profile: Profile): PrismaProfile {
  return {
    userId: profile.getUserId().toPrimitives(),
    firstName: profile.getFirstName().toPrimitives(),
    lastName: profile.getLastName().toPrimitives(),
    birthDate: profile.getBirthDate().toPrimitives(),
    phone: profile.getPhone().toPrimitives(),
    address: profile.getAddress().toPrimitives(),
    bio: profile.getBio().toPrimitives(),
    profilePictureUrl: profile.getPictureUrl().toPrimitives(),
    createdAt: profile.getCreatedAt(),
    updatedAt: profile.getUpdatedAt(),
  };
}
