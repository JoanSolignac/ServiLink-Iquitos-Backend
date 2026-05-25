import { DomainException } from './domain.exception';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

export class HashRequiredException extends DomainException {
  constructor() {
    super('Hash is required', DomainErrorCode.HASH_REQUIRED);
  }
}
