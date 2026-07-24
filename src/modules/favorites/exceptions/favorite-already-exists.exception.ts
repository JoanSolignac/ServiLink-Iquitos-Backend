import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class FavoriteAlreadyExistsException extends DomainException {
  constructor() {
    super(
      'Service is already in your favorites',
      DomainErrorCode.FAVORITE_ALREADY_EXISTS,
    );
  }
}
