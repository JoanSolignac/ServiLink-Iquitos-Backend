import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class FavoriteNotAllowedException extends DomainException {
  constructor(message = 'Cannot add this service to favorites') {
    super(message, DomainErrorCode.FAVORITE_NOT_ALLOWED);
  }
}
