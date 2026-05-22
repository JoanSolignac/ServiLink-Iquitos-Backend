import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserAlreadyInactiveException extends DomainException {
  constructor() {
    super('User already inactive', DomainErrorCode.USER_ALREADY_INACTIVE);
  }
}
