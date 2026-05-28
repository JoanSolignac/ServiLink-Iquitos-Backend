import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ServicePriceInvalidException extends DomainException {
  constructor() {
    super(
      'Service price must be a non-negative number',
      DomainErrorCode.SERVICE_PRICE_INVALID,
    );
  }
}
