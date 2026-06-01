import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserAlreadyInactiveException extends DomainException {
  constructor() {
    super('User is already inactive', DomainErrorCode.USER_ALREADY_INACTIVE);
  }
}
