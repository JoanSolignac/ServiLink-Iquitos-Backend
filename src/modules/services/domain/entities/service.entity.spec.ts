import { Service } from './service.entity';
import { ServiceId } from '../value-objects/service-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ServiceTitle } from '../value-objects/service-title.value-object';
import { ServiceDescription } from '../value-objects/service-description.value-object';
import { ServicePrice } from '../value-objects/service-price.value-object';
import { ServiceStatus } from '../enums/service-status.enum';

describe('Service Entity', () => {
  const serviceId = ServiceId.from('01900000-0000-7000-8000-000000000001');
  const userId = UserId.from('01900000-0000-7000-8000-000000000002');

  it('should create a service with REQUIRE_REVIEW status', () => {
    const service = Service.create(
      serviceId,
      userId,
      ServiceTitle.from('Test Service'),
      ServiceDescription.from('This is a test description'),
      ServicePrice.from(150.5),
      ['test', 'service'],
    );

    expect(service.getId().equals(serviceId)).toBe(true);
    expect(service.getUserId().equals(userId)).toBe(true);
    expect(service.getTitle().toPrimitives()).toBe('Test Service');
    expect(service.getDescription().toPrimitives()).toBe(
      'This is a test description',
    );
    expect(service.getPrice().toPrimitives()).toBe(150.5);
    expect(service.getStatus()).toBe(ServiceStatus.REQUIRE_REVIEW);
    expect(service.getKeywords()).toEqual(['test', 'service']);
  });

  it('should approve a service', () => {
    const service = Service.create(
      serviceId,
      userId,
      ServiceTitle.from('Test Service'),
      ServiceDescription.from('This is a test description'),
      ServicePrice.from(150.5),
      [],
    );

    service.approve();
    expect(service.getStatus()).toBe(ServiceStatus.APPROVED);
  });

  it('should reject a service', () => {
    const service = Service.create(
      serviceId,
      userId,
      ServiceTitle.from('Test Service'),
      ServiceDescription.from('This is a test description'),
      ServicePrice.from(150.5),
      [],
    );

    service.reject();
    expect(service.getStatus()).toBe(ServiceStatus.REJECTED);
  });

  it('should reset status to REQUIRE_REVIEW on updateInfo', () => {
    const service = Service.fromPersistence(
      serviceId,
      userId,
      ServiceTitle.from('Test Service'),
      ServiceDescription.from('This is a test description'),
      ServicePrice.from(150.5),
      ServiceStatus.APPROVED,
      [],
      new Date(),
      new Date(),
    );

    expect(service.getStatus()).toBe(ServiceStatus.APPROVED);

    service.updateInfo(
      ServiceTitle.from('Updated Title'),
      ServiceDescription.from('Updated Description'),
      ServicePrice.from(200.0),
      ['new'],
    );

    expect(service.getStatus()).toBe(ServiceStatus.REQUIRE_REVIEW);
    expect(service.getTitle().toPrimitives()).toBe('Updated Title');
    expect(service.getDescription().toPrimitives()).toBe('Updated Description');
    expect(service.getPrice().toPrimitives()).toBe(200.0);
    expect(service.getKeywords()).toEqual(['new']);
  });
});
