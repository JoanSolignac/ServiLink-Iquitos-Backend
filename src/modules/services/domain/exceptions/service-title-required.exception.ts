import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ServiceTitleRequiredException extends DomainException {
  constructor() {
    super('Service title is required', DomainErrorCode.SERVICE_TITLE_REQUIRED);
  }
}
