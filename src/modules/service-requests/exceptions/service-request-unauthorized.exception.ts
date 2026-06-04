import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceRequestUnauthorizedException extends DomainException {
  constructor() {
    super(
      'You are not authorized to perform this action on the service request',
      DomainErrorCode.SERVICE_REQUEST_UNAUTHORIZED,
    );
  }
}
