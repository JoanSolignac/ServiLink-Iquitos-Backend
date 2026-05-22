import { DomainId } from '../../../../shared/value-objects/domain-id.value-object';

export class UserId extends DomainId {
  static from(value: string): UserId {
    const id = DomainId.validate(value);
    return new UserId(id);
  }
}
