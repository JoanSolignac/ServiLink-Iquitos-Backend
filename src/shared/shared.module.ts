import { Module } from '@nestjs/common';
import { IdGenerator } from './domain/identity/ports/id-generator.abstract';
import { UuidV7IdGenerator } from './infrastructure/identity/generators/uuid-v7-id.generator';

@Module({
  exports: [IdGenerator],
  providers: [
    {
      provide: IdGenerator,
      useClass: UuidV7IdGenerator,
    },
  ],
})
export class SharedModule {}
