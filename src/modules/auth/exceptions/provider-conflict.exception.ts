import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class ProviderConflictException extends DomainException {
  constructor() {
    super(
      'This email is registered with Google. Please sign in with Google.',
      DomainErrorCode.PROVIDER_CONFLICT,
    );
  }
}
