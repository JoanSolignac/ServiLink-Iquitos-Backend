import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class ProfileAlreadyExistsException extends DomainException {
  constructor() {
    super('Profile already exists', DomainErrorCode.PROFILE_ALREADY_EXISTS);
  }
}
