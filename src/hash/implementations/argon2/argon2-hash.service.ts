import { Injectable } from '@nestjs/common';
import { HashService } from '../../../shared/abstractions/hash-service.abstract';
import argon2 from 'argon2';

@Injectable()
export class Argon2HashService implements HashService {
  hash(value: string): Promise<string> {
    return argon2.hash(value);
  }
  async validate(value: string, hashedValue: string): Promise<boolean> {
    return argon2.verify(hashedValue, value);
  }
}
