import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserSuspendException extends DomainException {
  constructor() {
    super('User account is suspended', DomainErrorCode.USER_SUSPENDED);
  }
}
