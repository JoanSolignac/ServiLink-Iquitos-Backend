import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class RatingNotFoundException extends DomainException {
  constructor() {
    super('Rating not found', DomainErrorCode.RATING_NOT_FOUND);
  }
}
