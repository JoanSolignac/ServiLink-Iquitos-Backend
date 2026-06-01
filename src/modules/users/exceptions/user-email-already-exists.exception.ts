import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class UserEmailAlreadyExistsException extends DomainException {
  constructor() {
    super('Email is already in use', DomainErrorCode.USER_ALREADY_EXISTS);
  }
}
