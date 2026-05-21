import { DomainException } from './domain.exception';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

export class DomainIdRequiredException extends DomainException {
  constructor() {
    super('Id is required', DomainErrorCode.ID_REQUIRED);
  }
}
