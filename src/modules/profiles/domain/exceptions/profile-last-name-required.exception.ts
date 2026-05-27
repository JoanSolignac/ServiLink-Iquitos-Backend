import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileLastNameRequiredException extends DomainException {
  constructor() {
    super('Last name is required', DomainErrorCode.PROFILE_LAST_NAME_REQUIRED);
  }
}
