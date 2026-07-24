import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class RatingNotAllowedException extends DomainException {
  constructor(message = 'Rating not allowed for this service request') {
    super(message, DomainErrorCode.RATING_NOT_ALLOWED);
  }
}
