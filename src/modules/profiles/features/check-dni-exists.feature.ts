import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckDniExistsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dni: string): Promise<boolean> {
    const profile = await this.prisma.profile.findFirst({
      where: { dni },
      select: { userId: true },
    });
    return profile !== null;
  }
}
