import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfileBirthDateInvalidException extends DomainException {
  constructor() {
    super('Birth date is invalid', DomainErrorCode.PROFILE_BIRTH_DATE_INVALID);
  }
}
