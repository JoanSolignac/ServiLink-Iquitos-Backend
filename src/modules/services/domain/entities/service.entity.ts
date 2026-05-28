import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ServiceTitle } from '../value-objects/service-title.value-object';
import { ServiceDescription } from '../value-objects/service-description.value-object';
import { ServicePrice } from '../value-objects/service-price.value-object';
import { ServiceStatus } from '../enums/service-status.enum';

export class Service {
  private constructor(
    private readonly id: ServiceId,
    private readonly userId: UserId,
    private title: ServiceTitle,
    private description: ServiceDescription,
    private price: ServicePrice,
    private status: ServiceStatus,
    private keywords: string[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    id: ServiceId,
    userId: UserId,
    title: ServiceTitle,
    description: ServiceDescription,
    price: ServicePrice,
    keywords: string[],
  ): Service {
    const now = new Date();
    return new Service(
      id,
      userId,
      title,
      description,
      price,
      ServiceStatus.REQUIRE_REVIEW,
      keywords,
      now,
      now,
    );
  }

  static fromPersistence(
    id: ServiceId,
    userId: UserId,
    title: ServiceTitle,
    description: ServiceDescription,
    price: ServicePrice,
    status: ServiceStatus,
    keywords: string[],
    createdAt: Date,
    updatedAt: Date,
  ): Service {
    return new Service(
      id,
      userId,
      title,
      description,
      price,
      status,
      keywords,
      createdAt,
      updatedAt,
    );
  }

  getId(): ServiceId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getTitle(): ServiceTitle {
    return this.title;
  }

  getDescription(): ServiceDescription {
    return this.description;
  }

  getPrice(): ServicePrice {
    return this.price;
  }

  getStatus(): ServiceStatus {
    return this.status;
  }

  getKeywords(): string[] {
    return this.keywords;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  approve(): void {
    this.status = ServiceStatus.APPROVED;
    this.touch();
  }

  reject(): void {
    this.status = ServiceStatus.REJECTED;
    this.touch();
  }

  updateInfo(
    title: ServiceTitle,
    description: ServiceDescription,
    price: ServicePrice,
    keywords: string[],
  ): void {
    this.title = title;
    this.description = description;
    this.price = price;
    this.keywords = keywords;
    this.status = ServiceStatus.REQUIRE_REVIEW;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
