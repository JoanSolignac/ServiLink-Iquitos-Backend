import { DomainId } from '../../../../shared/value-objects/domain-id.value-object';

export class UserId extends DomainId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): UserId {
    const id = UserId.validate(value);
    return new UserId(id);
  }
}
