import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserAlreadySuspendedException extends DomainException {
  constructor() {
    super('User is already suspended', DomainErrorCode.USER_ALREADY_SUSPENDED);
  }
}
