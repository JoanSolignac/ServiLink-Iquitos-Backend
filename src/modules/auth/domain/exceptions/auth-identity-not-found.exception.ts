import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class AuthIdentityNotFoundException extends DomainException {
  constructor() {
    super('Auth identity not found', DomainErrorCode.AUTH_IDENTITY_NOT_FOUND);
  }
}
