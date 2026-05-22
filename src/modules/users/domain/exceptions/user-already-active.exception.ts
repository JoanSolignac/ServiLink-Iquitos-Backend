import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserAlreadyActiveException extends DomainException {
  constructor() {
    super('User already active', DomainErrorCode.USER_ALREADY_ACTIVE);
  }
}
