import { HashedValue } from '../../../../shared/value-objects/hash-value.value-object';

export class PasswordHash extends HashedValue {
  constructor(value: string) {
    super(value);
  }

  static from(value: string): PasswordHash {
    const hash = PasswordHash.validate(value);
    return new PasswordHash(hash);
  }
}
