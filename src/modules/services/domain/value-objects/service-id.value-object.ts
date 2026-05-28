import { DomainId } from '../../../../shared/value-objects/domain-id.value-object';

export class ServiceId extends DomainId {
  private constructor(value: string) {
    super(value);
  }

  static from(value: string): ServiceId {
    const id = ServiceId.validate(value);
    return new ServiceId(id);
  }
}
