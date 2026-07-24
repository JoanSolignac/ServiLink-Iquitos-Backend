import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class EmailAlreadyVerifiedException extends DomainException {
  constructor() {
    super(
      'The email is already verified.',
      DomainErrorCode.EMAIL_ALREADY_VERIFIED,
    );
  }
}
