import { DomainException } from '@common/exceptions/domain.exception';
import { DomainErrorCode } from '@common/enums/domain-error-code.enum';

export class Auth0ManagementException extends DomainException {
  constructor(
    message = 'Failed to communicate with the Auth0 Management API.',
  ) {
    super(message, DomainErrorCode.AUTH0_MANAGEMENT_ERROR);
  }
}
