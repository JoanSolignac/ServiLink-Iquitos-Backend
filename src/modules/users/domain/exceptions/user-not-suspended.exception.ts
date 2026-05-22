import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserNotSuspendedException extends DomainException {
  constructor() {
    super('User not suspended', DomainErrorCode.USER_NOT_SUSPENDED);
  }
}
