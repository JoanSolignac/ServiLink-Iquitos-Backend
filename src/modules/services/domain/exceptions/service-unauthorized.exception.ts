import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ServiceUnauthorizedException extends DomainException {
  constructor() {
    super(
      'Unauthorized action on this service',
      DomainErrorCode.SERVICE_UNAUTHORIZED,
    );
  }
}
