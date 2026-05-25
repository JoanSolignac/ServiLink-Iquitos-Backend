import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class InvalidProviderException extends DomainException {
  constructor() {
    super('Invalid provider', DomainErrorCode.INVALID_PROVIDER);
  }
}
