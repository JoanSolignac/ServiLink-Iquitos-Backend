import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ReportCooldownActiveException extends DomainException {
  constructor() {
    super(
      'You already submitted a report for this target within the last 24 hours',
      DomainErrorCode.REPORT_COOLDOWN_ACTIVE,
    );
  }
}
