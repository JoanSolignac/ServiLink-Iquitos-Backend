import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class StripeNoActivePriceException extends DomainException {
  constructor() {
    super(
      'No active price found for the premium product in Stripe',
      DomainErrorCode.STRIPE_NO_ACTIVE_PRICE,
    );
  }
}
