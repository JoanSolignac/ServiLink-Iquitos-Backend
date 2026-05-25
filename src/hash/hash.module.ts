import { Module } from '@nestjs/common';
import { HashService } from '../shared/abstractions/hash-service.abstract';
import { Argon2HashService } from './implementations/argon2/argon2-hash.service';

@Module({
  providers: [
    {
      provide: HashService,
      useClass: Argon2HashService,
    },
  ],
  exports: [HashService],
})
export class HashModule {}
