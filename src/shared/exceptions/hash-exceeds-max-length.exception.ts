import { DomainException } from './domain.exception';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

export class HashExceedsMaxLengthException extends DomainException {
  constructor() {
    super(
      'Hash exceeds maximum length of 255 characters',
      DomainErrorCode.HASH_EXCEEDS_MAX_LENGTH,
    );
  }
}
