import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceLimitReachedException extends DomainException {
  constructor() {
    super(
      'Free users can only create up to 2 services. Upgrade to premium to create more.',
      DomainErrorCode.SERVICE_LIMIT_REACHED,
    );
  }
}
