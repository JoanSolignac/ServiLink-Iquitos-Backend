import { DomainException } from './domain.exception';
import { DomainErrorCode } from './domain-error-code.enum';

export class DomainIdRequiredException extends DomainException {
  constructor() {
    super('Id is required', DomainErrorCode.ID_REQUIRED);
  }
}
