import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ProfilePictureInvalidFormatException extends DomainException {
  constructor() {
    super(
      'Profile picture must be a .jpg, .jpeg, .png or .webp file',
      DomainErrorCode.PROFILE_PICTURE_INVALID_FORMAT,
    );
  }
}
