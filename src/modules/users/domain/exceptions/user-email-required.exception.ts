import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserEmailRequiredException extends DomainException {
  constructor() {
    super('User email is required.', DomainErrorCode.USER_EMAIL_REQUIRED);
  }
}
