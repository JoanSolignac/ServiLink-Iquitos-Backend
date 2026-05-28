import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEmail } from '../../domain/value-objects/user-email.value-object';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { PrismaService } from '../../../../prisma/prisma.service';
import { toDomainUser, toPersistenceUser } from '../mappers/prisma-user.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(email: UserEmail): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toPrimitives() },
    });

    return Boolean(user);
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toPrimitives() },
    });

    return user ? toDomainUser(user) : null;
  }

  async findByIdOrThrow(userId: UserId): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId.toPrimitives() },
      });

      return toDomainUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundException();
      }

      throw error;
    }
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toPrimitives() },
    });

    return user ? toDomainUser(user) : null;
  }

  async create(user: User): Promise<void> {
    try {
      const data = toPersistenceUser(user);

      await this.prisma.user.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new UserAlreadyExistsException();
      }

      throw error;
    }
  }

  async update(user: User): Promise<void> {
    const data = toPersistenceUser(user);

    await this.prisma.user.update({
      where: { id: data.id },
      data: data,
    });
  }

  async upsert(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getId().toPrimitives() },
      create: toPersistenceUser(user),
      update: toPersistenceUser(user),
    });
  }
}
