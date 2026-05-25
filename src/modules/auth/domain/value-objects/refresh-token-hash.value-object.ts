import { HashedValue } from '../../../../shared/value-objects/hash-value.value-object';

export class RefreshTokenHash extends HashedValue {
  constructor(value: string) {
    super(value);
  }

  static from(value: string): RefreshTokenHash {
    const hash = RefreshTokenHash.validate(value);
    return new RefreshTokenHash(hash);
  }
}
