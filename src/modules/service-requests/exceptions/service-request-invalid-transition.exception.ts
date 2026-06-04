import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceRequestInvalidTransitionException extends DomainException {
  constructor() {
    super(
      'The current status does not allow this action',
      DomainErrorCode.SERVICE_REQUEST_INVALID_TRANSITION,
    );
  }
}
