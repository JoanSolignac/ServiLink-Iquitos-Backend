import { DomainException } from '../../../common/exceptions/domain.exception';
import { DomainErrorCode } from '../../../common/enums/domain-error-code.enum';

export class DniAlreadyInUseException extends DomainException {
  constructor() {
    super('DNI is already in use', DomainErrorCode.DNI_ALREADY_IN_USE);
  }
}
