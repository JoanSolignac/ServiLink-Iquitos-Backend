import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class SubscriptionAlreadyActiveException extends DomainException {
  constructor() {
    super(
      'User already has an active premium subscription',
      DomainErrorCode.SUBSCRIPTION_ALREADY_ACTIVE,
    );
  }
}
