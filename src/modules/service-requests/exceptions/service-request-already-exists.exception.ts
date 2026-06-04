import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceRequestAlreadyExistsException extends DomainException {
  constructor() {
    super(
      'You already have an active request for this service',
      DomainErrorCode.SERVICE_REQUEST_ALREADY_EXISTS,
    );
  }
}
