import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserAlreadyHasRoleException extends DomainException {
  constructor() {
    super('User already has this role', DomainErrorCode.USER_ALREADY_HAS_ROLE);
  }
}
