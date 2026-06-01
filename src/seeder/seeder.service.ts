import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedUser('joanpsolignac@gmail.com', UserRole.ADMINISTRATOR);
    await this.seedUser('joansolignaclovera@gmail.com', UserRole.MODERATOR);
  }

  private async seedUser(email: string, role: UserRole) {
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (!existing) {
      await this.prisma.user.create({
        data: {
          id: randomUUID(),
          email,
          role,
          status: 'ACTIVE',
        },
      });
    }
  }
}
