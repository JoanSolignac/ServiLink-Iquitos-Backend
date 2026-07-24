import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceAlreadyApprovedException extends DomainException {
  constructor() {
    super('Service already approved', DomainErrorCode.SERVICE_ALREADY_APPROVED);
  }
}
