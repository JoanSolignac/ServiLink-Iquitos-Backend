import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class StripeSessionFailedException extends DomainException {
  constructor() {
    super(
      'Stripe failed to create the session URL',
      DomainErrorCode.STRIPE_SESSION_FAILED,
    );
  }
}
