import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { FindUserByIdFeature } from '../../users/features/find-user-by-id.feature';
import { ProviderConflictException } from '../exceptions/provider-conflict.exception';

@Injectable()
export class SyncUserFeature {
  private readonly logger = new Logger(SyncUserFeature.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly findUserByIdFeature: FindUserByIdFeature,
  ) {}

  async execute(
    providerId: string,
    email: string,
    provider: string,
  ): Promise<User> {
    this.logger.log(
      `SyncUser input: provider=${provider}, providerId=${providerId}, email=${email}`,
    );

    const normalizedProvider = provider.trim().toLowerCase();
    const normalizedProviderId = providerId.trim();

    // Buscar identidad existente
    const existingIdentity = await this.prisma.authIdentity.findFirst({
      where: {
        provider: normalizedProvider,
        providerId: normalizedProviderId,
      },
    });

    if (existingIdentity) {
      const user = await this.findUserByIdFeature.execute(
        existingIdentity.userId,
      );
      this.logger.log(`Existing identity found for user: id=${user.id}`);
      return user;
    }

    // Buscar usuario por email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    // Usuario existente
    if (existingUser) {
      const existingIdentities = await this.prisma.authIdentity.findMany({
        where: { userId: existingUser.id },
        select: { provider: true },
      });

      const existingProviders = existingIdentities.map((i) => i.provider);

      if (
        existingProviders.includes('google-oauth2') &&
        normalizedProvider !== 'google-oauth2'
      ) {
        throw new ProviderConflictException();
      }

      await this.prisma.authIdentity.create({
        data: {
          userId: existingUser.id,
          provider: normalizedProvider,
          providerId: normalizedProviderId,
        },
      });

      this.logger.log(
        `New auth identity linked to existing user: id=${existingUser.id}`,
      );
      return existingUser;
    }

    // Usuario completamente nuevo
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          role: UserRole.USER,
          status: 'ACTIVE',
        },
      });

      await tx.authIdentity.create({
        data: {
          userId: user.id,
          provider: normalizedProvider,
          providerId: normalizedProviderId,
        },
      });

      return user;
    });

    this.logger.log(`New user created: id=${newUser.id}`);
    return newUser;
  }
}
