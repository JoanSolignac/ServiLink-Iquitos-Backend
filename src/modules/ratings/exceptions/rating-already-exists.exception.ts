import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class RatingAlreadyExistsException extends DomainException {
  constructor() {
    super(
      'A rating already exists for this service request',
      DomainErrorCode.RATING_ALREADY_EXISTS,
    );
  }
}
