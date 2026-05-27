import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfilePictureTooLargeException extends DomainException {
  constructor() {
    super(
      'Profile picture must not exceed 6 MB',
      DomainErrorCode.PROFILE_PICTURE_TOO_LARGE,
    );
  }
}
