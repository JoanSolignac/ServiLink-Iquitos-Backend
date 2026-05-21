import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionManager } from '../shared/abstractions/transaction-manager.abstract';
import { PrismaTransactionManager } from './transactions/prisma-transaction-manager';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: TransactionManager,
      useClass: PrismaTransactionManager,
    },
  ],
  exports: [PrismaService, TransactionManager],
})
export class PrismaModule {}
