import { AuthIdentityRepository } from '../../domain/repositories/auth-identity.repository';
import { AuthIdentity } from '../../domain/entities/auth-identity.entity';
import { AuthIdentityId } from '../../domain/value-objects/auth-identity-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  toDomainAuthIdentity,
  toPersistenceAuthIdentity,
} from '../mappers/prisma-auth-identity.mapper';
import { Injectable } from '@nestjs/common';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';

@Injectable()
export class PrismaAuthIdentityRepository implements AuthIdentityRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByProviderId(providerId: ProviderId): Promise<AuthIdentity | null> {
    const authIdentity = await this.prisma.authIdentity.findFirst({
      where: { providerId: providerId.toPrimitives() },
    });

    return authIdentity ? toDomainAuthIdentity(authIdentity) : null;
  }

  async findByUserId(id: UserId): Promise<AuthIdentity | null> {
    const authIdentity = await this.prisma.authIdentity.findFirst({
      where: { userId: id.toPrimitives() },
    });

    return authIdentity ? toDomainAuthIdentity(authIdentity) : null;
  }

  async findById(id: AuthIdentityId): Promise<AuthIdentity | null> {
    const authIdentity = await this.prisma.authIdentity.findUnique({
      where: { id: id.toPrimitives() },
    });

    return authIdentity ? toDomainAuthIdentity(authIdentity) : null;
  }

  async create(authIdentity: AuthIdentity): Promise<void> {
    const data = toPersistenceAuthIdentity(authIdentity);

    await this.prisma.authIdentity.create({
      data,
    });
  }

  async update(authIdentity: AuthIdentity): Promise<void> {
    const data = toPersistenceAuthIdentity(authIdentity);

    await this.prisma.authIdentity.update({
      where: { id: data.id },
      data,
    });
  }
}
