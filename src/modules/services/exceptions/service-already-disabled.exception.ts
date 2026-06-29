import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ServiceAlreadyDisabledException extends DomainException {
  constructor() {
    super(
      'Service is already disabled',
      DomainErrorCode.SERVICE_ALREADY_DISABLED,
    );
  }
}
