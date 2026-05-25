import { DomainId } from '../../../../shared/value-objects/domain-id.value-object';

export class AuthIdentityId extends DomainId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): AuthIdentityId {
    const id = AuthIdentityId.validate(value);
    return new AuthIdentityId(id);
  }
}
