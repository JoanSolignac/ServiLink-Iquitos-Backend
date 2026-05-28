import { DomainException } from '../../../../shared/exceptions/domain.exception';
import { DomainErrorCode } from '../../../../shared/enums/domain-error-code.enum';

export class ServiceDescriptionRequiredException extends DomainException {
  constructor() {
    super(
      'Service description is required',
      DomainErrorCode.SERVICE_DESCRIPTION_REQUIRED,
    );
  }
}
