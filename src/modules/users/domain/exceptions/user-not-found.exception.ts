import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserNotFoundException extends DomainException {
  constructor() {
    super('User not found', DomainErrorCode.USER_NOT_FOUND);
  }
}
