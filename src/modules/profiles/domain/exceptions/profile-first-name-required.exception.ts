import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileFirstNameRequiredException extends DomainException {
  constructor() {
    super(
      'First name is required',
      DomainErrorCode.PROFILE_FIRST_NAME_REQUIRED,
    );
  }
}
