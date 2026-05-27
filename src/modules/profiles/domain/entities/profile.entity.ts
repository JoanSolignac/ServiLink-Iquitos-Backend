import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ProfileFirstName } from '../value-objects/profile-first-name.value-object';
import { ProfileLastName } from '../value-objects/profile-last-name.value-object';
import { ProfileBirthDate } from '../value-objects/profile-birth-date.value-object';
import { ProfilePhone } from '../value-objects/profile-phone.value-object';
import { ProfileAddress } from '../value-objects/profile-address.value-object';
import { ProfileBio } from '../value-objects/profile-bio.value-object';
import { ProfilePictureUrl } from '../value-objects/profile-picture-url.value-object';

export class Profile {
  private constructor(
    private readonly userId: UserId,
    private firstName: ProfileFirstName,
    private lastName: ProfileLastName,
    private birthDate: ProfileBirthDate,
    private phone: ProfilePhone,
    private address: ProfileAddress,
    private bio: ProfileBio,
    private pictureUrl: ProfilePictureUrl,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    userId: UserId,
    firstName: ProfileFirstName,
    lastName: ProfileLastName,
    birthDate: ProfileBirthDate,
    phone: ProfilePhone,
    address: ProfileAddress,
    bio: ProfileBio,
    pictureUrl: ProfilePictureUrl,
  ): Profile {
    const now = new Date();
    return new Profile(
      userId,
      firstName,
      lastName,
      birthDate,
      phone,
      address,
      bio,
      pictureUrl,
      now,
      now,
    );
  }

  static fromPersistence(
    userId: UserId,
    firstName: ProfileFirstName,
    lastName: ProfileLastName,
    birthDate: ProfileBirthDate,
    phone: ProfilePhone,
    address: ProfileAddress,
    bio: ProfileBio,
    pictureUrl: ProfilePictureUrl,
    createdAt: Date,
    updatedAt: Date,
  ): Profile {
    return new Profile(
      userId,
      firstName,
      lastName,
      birthDate,
      phone,
      address,
      bio,
      pictureUrl,
      createdAt,
      updatedAt,
    );
  }

  getUserId(): UserId {
    return this.userId;
  }

  getFirstName(): ProfileFirstName {
    return this.firstName;
  }

  getLastName(): ProfileLastName {
    return this.lastName;
  }

  getBirthDate(): ProfileBirthDate {
    return this.birthDate;
  }

  getPhone(): ProfilePhone {
    return this.phone;
  }

  getAddress(): ProfileAddress {
    return this.address;
  }

  getBio(): ProfileBio {
    return this.bio;
  }

  getPictureUrl(): ProfilePictureUrl {
    return this.pictureUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  updatePersonalInfo(
    firstName: ProfileFirstName,
    lastName: ProfileLastName,
    birthDate: ProfileBirthDate,
    phone: ProfilePhone,
    address: ProfileAddress,
  ): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.phone = phone;
    this.address = address;
    this.touch();
  }

  updateBio(bio: ProfileBio): void {
    this.bio = bio;
    this.touch();
  }

  updatePicture(pictureUrl: ProfilePictureUrl): void {
    this.pictureUrl = pictureUrl;
    this.touch();
  }

  removePicture(): void {
    this.pictureUrl = ProfilePictureUrl.from(null);
    this.touch();
  }
}
