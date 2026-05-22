import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEmail } from '../../domain/value-objects/user-email.value-object';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  toDomainUser,
  toDomainUserList,
  toPersistenceUser,
} from '../mappers/prisma-user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(email: UserEmail): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toPrimitives() },
    });

    return Boolean(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return toDomainUserList(users);
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toPrimitives() },
    });

    return user ? toDomainUser(user) : null;
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toPrimitives() },
    });

    return user ? toDomainUser(user) : null;
  }

  async save(user: User): Promise<void> {
    const toPersist = toPersistenceUser(user);

    await this.prisma.user.upsert({
      create: toPersist,
      update: toPersist,
      where: { id: user.getId().toPrimitives() },
    });
  }
}
