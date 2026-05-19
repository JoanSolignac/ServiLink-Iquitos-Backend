import { DomainErrorCode } from './domain-error-code.enum';

export abstract class DomainException extends Error {
  protected constructor(
    readonly message: string,
    public errorCode: DomainErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
