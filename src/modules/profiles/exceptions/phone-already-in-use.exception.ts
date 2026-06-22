import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class PhoneAlreadyInUseException extends DomainException {
  constructor() {
    super(
      'Phone number is already in use',
      DomainErrorCode.PHONE_ALREADY_IN_USE,
    );
  }
}
