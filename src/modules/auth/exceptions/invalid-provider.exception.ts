import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class InvalidProviderException extends DomainException {
  constructor() {
    super('Invalid provider', DomainErrorCode.INVALID_PROVIDER);
  }
}
