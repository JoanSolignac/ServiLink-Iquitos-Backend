import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class ProfileNotFoundException extends DomainException {
  constructor() {
    super('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND);
  }
}
