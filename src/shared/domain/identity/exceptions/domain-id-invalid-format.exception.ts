import { DomainException } from './domain.exception';
import { DomainErrorCode } from './domain-error-code.enum';

export class DomainIdInvalidFormatException extends DomainException {
  constructor() {
    super('Id invalid format', DomainErrorCode.ID_INVALID_FORMAT);
  }
}
