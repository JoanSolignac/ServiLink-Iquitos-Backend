import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ReportNotFoundException extends DomainException {
  constructor() {
    super('Report not found', DomainErrorCode.REPORT_NOT_FOUND);
  }
}
