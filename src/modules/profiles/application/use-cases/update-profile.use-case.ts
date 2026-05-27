import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileFirstName } from '../../domain/value-objects/profile-first-name.value-object';
import { ProfileLastName } from '../../domain/value-objects/profile-last-name.value-object';
import { ProfileBirthDate } from '../../domain/value-objects/profile-birth-date.value-object';
import { ProfilePhone } from '../../domain/value-objects/profile-phone.value-object';
import { ProfileAddress } from '../../domain/value-objects/profile-address.value-object';
import { ProfileBio } from '../../domain/value-objects/profile-bio.value-object';
import { ProfilePictureUrl } from '../../domain/value-objects/profile-picture-url.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { FileStorage } from '../../../../shared/abstractions/file-storage.abstract';
import { IdGenerator } from '../../../../shared/abstractions/id-generator.abstract';
import { UpdateProfilePayload } from '../../domain/interfaces/update-profile-payload.interface';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly fileStorage: FileStorage,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(payload: UpdateProfilePayload): Promise<Profile> {
    const profile = await this.profileRepository.findByUserIdOrThrow(
      payload.userId,
    );

    const oldPictureUrl = profile.getPictureUrl().toPrimitives();

    if (payload.pictureFile) {
      const newPictureUrl = await this.fileStorage.upload({
        file: payload.pictureFile.buffer,
        fileName: this.generateFileName(payload.pictureFile.originalname),
        contentType: payload.pictureFile.mimetype,
        folder: 'profiles',
      });

      profile.updatePicture(ProfilePictureUrl.from(newPictureUrl));

      if (oldPictureUrl) {
        await this.fileStorage.delete(oldPictureUrl).catch(() => {
          // Silently fail if old image cannot be deleted
        });
      }
    }

    profile.updatePersonalInfo(
      ProfileFirstName.from(payload.firstName),
      ProfileLastName.from(payload.lastName),
      ProfileBirthDate.from(payload.birthDate),
      ProfilePhone.from(payload.phone),
      ProfileAddress.from(payload.address),
    );

    profile.updateBio(ProfileBio.from(payload.bio));

    await this.profileRepository.update(profile);

    return profile;
  }

  private generateFileName(originalName: string): string {
    const ext = originalName.split('.').pop() || 'jpg';
    const date = new Date().toISOString().split('T')[0];
    const id = this.idGenerator.generate();
    return `${date}-${id}.${ext}`;
  }
}
