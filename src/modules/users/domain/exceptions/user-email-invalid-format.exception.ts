import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserEmailInvalidFormatException extends DomainException {
  constructor() {
    super('Email invalid format', DomainErrorCode.USER_EMAIL_INVALID_FORMAT);
  }
}
