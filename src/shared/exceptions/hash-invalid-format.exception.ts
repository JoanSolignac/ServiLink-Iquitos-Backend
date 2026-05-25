import { DomainException } from './domain.exception';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

export class HashInvalidFormatException extends DomainException {
  constructor() {
    super('Hash has an invalid format', DomainErrorCode.HASH_INVALID_FORMAT);
  }
}
