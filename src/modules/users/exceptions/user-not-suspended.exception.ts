import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserNotSuspendedException extends DomainException {
  constructor() {
    super('User is not suspended', DomainErrorCode.USER_NOT_SUSPENDED);
  }
}
