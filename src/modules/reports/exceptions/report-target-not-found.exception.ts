import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ReportTargetNotFoundException extends DomainException {
  constructor() {
    super('Report target not found', DomainErrorCode.REPORT_TARGET_NOT_FOUND);
  }
}
