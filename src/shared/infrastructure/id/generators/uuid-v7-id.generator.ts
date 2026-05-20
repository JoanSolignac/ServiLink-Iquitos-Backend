import { v7 as uuidV7 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../../domain/id/ports/id-generator.abstract';

@Injectable()
export class UuidV7IdGenerator extends IdGenerator {
  generate(): string {
    return uuidV7();
  }
}
