import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileAlreadyExistsException extends DomainException {
  constructor() {
    super('Profile already exists', DomainErrorCode.PROFILE_ALREADY_EXISTS);
  }
}
