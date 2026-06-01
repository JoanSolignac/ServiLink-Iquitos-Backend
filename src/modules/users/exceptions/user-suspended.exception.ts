import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserSuspendedException extends DomainException {
  constructor() {
    super('User is suspended', DomainErrorCode.USER_SUSPENDED);
  }
}
