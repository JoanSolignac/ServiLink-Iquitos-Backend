import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceNotFoundException extends DomainException {
  constructor() {
    super('Service not found', DomainErrorCode.SERVICE_NOT_FOUND);
  }
}
