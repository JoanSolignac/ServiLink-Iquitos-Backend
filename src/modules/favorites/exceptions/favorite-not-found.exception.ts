import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class FavoriteNotFoundException extends DomainException {
  constructor() {
    super('Favorite not found', DomainErrorCode.FAVORITE_NOT_FOUND);
  }
}
