import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class UserAlreadyExistsException extends DomainException {
  constructor() {
    super('User already exists', DomainErrorCode.USER_ALREADY_EXISTS);
  }
}
