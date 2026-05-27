import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileNotFoundException extends DomainException {
  constructor() {
    super('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND);
  }
}
