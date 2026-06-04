import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceRequestNotFoundException extends DomainException {
  constructor() {
    super(
      'Service request not found',
      DomainErrorCode.SERVICE_REQUEST_NOT_FOUND,
    );
  }
}
