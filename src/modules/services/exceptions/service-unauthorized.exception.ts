import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceUnauthorizedException extends DomainException {
  constructor() {
    super(
      'Unauthorized to access this service',
      DomainErrorCode.SERVICE_UNAUTHORIZED,
    );
  }
}
