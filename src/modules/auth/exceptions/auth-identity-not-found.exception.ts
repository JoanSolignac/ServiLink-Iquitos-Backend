import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class AuthIdentityNotFoundException extends DomainException {
  constructor() {
    super('Auth identity not found', DomainErrorCode.AUTH_IDENTITY_NOT_FOUND);
  }
}
