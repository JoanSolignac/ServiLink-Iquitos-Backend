import { TransactionManager } from '../../shared/abstractions/transaction-manager.abstract';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => operation());
  }
}
