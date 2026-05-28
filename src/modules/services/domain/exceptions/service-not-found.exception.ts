import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ServiceNotFoundException extends DomainException {
  constructor() {
    super('Service not found', DomainErrorCode.SERVICE_NOT_FOUND);
  }
}
