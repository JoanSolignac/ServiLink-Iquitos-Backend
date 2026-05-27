import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileBirthDateRequiredException extends DomainException {
  constructor() {
    super(
      'Birth date is required',
      DomainErrorCode.PROFILE_BIRTH_DATE_REQUIRED,
    );
  }
}
