import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class StripeNoCustomerException extends DomainException {
  constructor() {
    super(
      'User has no active Stripe billing history',
      DomainErrorCode.STRIPE_NO_CUSTOMER,
    );
  }
}
