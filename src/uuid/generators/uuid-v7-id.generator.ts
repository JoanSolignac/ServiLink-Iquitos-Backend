import { v7 as uuidV7 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../shared/abstractions/id-generator.abstract';

@Injectable()
export class UuidV7IdGenerator extends IdGenerator {
  generate(): string {
    return uuidV7();
  }
}
