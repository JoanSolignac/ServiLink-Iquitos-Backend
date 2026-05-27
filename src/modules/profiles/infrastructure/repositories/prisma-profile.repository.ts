import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import {
  toDomainProfile,
  toPersistenceProfile,
} from '../mappers/prisma-profile.mapper';
import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';
import { ProfileAlreadyExistsException } from '../../domain/exceptions/profile-already-exists.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByUserId(userId: UserId): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: userId.toPrimitives() },
    });

    return Boolean(profile);
  }

  async findByUserId(userId: UserId): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: userId.toPrimitives() },
    });

    return profile ? toDomainProfile(profile) : null;
  }

  async findByUserIdOrThrow(userId: UserId): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: userId.toPrimitives() },
    });

    if (!profile) {
      throw new ProfileNotFoundException();
    }

    return toDomainProfile(profile);
  }

  async create(profile: Profile): Promise<void> {
    try {
      const data = toPersistenceProfile(profile);
      await this.prisma.profile.create({ data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ProfileAlreadyExistsException();
      }

      throw error;
    }
  }

  async update(profile: Profile): Promise<void> {
    const data = toPersistenceProfile(profile);

    await this.prisma.profile.update({
      where: { userId: data.userId },
      data,
    });
  }
}
