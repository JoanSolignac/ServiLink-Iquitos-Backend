import { IdGenerator } from '../../../domain/identity/ports/id-generator.abstract';
import { v7 as uuidV7 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UuidV7IdGenerator extends IdGenerator {
  generate(): string {
    return uuidV7();
  }
}
