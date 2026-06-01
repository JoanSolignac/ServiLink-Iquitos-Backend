import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserAlreadyActiveException extends DomainException {
  constructor() {
    super('User is already active', DomainErrorCode.USER_ALREADY_ACTIVE);
  }
}
