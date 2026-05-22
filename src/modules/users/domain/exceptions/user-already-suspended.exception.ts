import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserAlreadySuspendedException extends DomainException {
  constructor() {
    super('User already suspended', DomainErrorCode.USER_ALREADY_SUSPENDED);
  }
}
