import { UserId } from '../value-objects/user-id.value-object';
import { UserEmail } from '../value-objects/user-email.value-object';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { UserSuspendException } from '../exceptions/user-suspend.exception';
import { UserAlreadyActiveException } from '../exceptions/user-already-active.exception';
import { UserAlreadyInactiveException } from '../exceptions/user-already-inactive.exception';
import { UserAlreadySuspendedException } from '../exceptions/user-already-suspended.exception';
import { UserNotSuspendedException } from '../exceptions/user-not-suspended.exception';

export class User {
  private constructor(
    private readonly id: UserId,
    private email: UserEmail,
    private role: UserRole,
    private status: UserStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(id: UserId, email: UserEmail): User {
    const now = new Date();
    return new User(id, email, UserRole.USER, UserStatus.ACTIVE, now, now);
  }

  static createAnAdministrator(id: UserId, email: UserEmail): User {
    const now = new Date();
    return new User(
      id,
      email,
      UserRole.ADMINISTRATOR,
      UserStatus.ACTIVE,
      now,
      now,
    );
  }

  static createAModerator(id: UserId, email: UserEmail): User {
    const now = new Date();
    return new User(id, email, UserRole.MODERATOR, UserStatus.ACTIVE, now, now);
  }

  static fromPersistence(
    id: UserId,
    email: UserEmail,
    role: UserRole,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, email, role, status, createdAt, updatedAt);
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): UserEmail {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this.status === UserStatus.INACTIVE;
  }

  isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED;
  }

  equals(other: User): boolean {
    return this.getId().equals(other.getId());
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private changeStatus(status: UserStatus): void {
    this.status = status;
    this.touch();
  }

  private ensureNotSuspended(): void {
    if (this.isSuspended()) {
      throw new UserSuspendException();
    }
  }

  updateEmail(email: UserEmail): void {
    this.ensureNotSuspended();

    if (this.email.equals(email)) {
      return;
    }

    this.email = email;
    this.touch();
  }

  updateRole(role: UserRole): void {
    this.ensureNotSuspended();

    if (this.role === role) {
      return;
    }

    this.role = role;
    this.touch();
  }

  activate(): void {
    this.ensureNotSuspended();

    if (this.isActive()) {
      throw new UserAlreadyActiveException();
    }

    this.changeStatus(UserStatus.ACTIVE);
  }

  deactivate(): void {
    this.ensureNotSuspended();

    if (this.isInactive()) {
      throw new UserAlreadyInactiveException();
    }

    this.changeStatus(UserStatus.INACTIVE);
  }

  suspend(): void {
    if (this.isSuspended()) {
      throw new UserAlreadySuspendedException();
    }

    this.changeStatus(UserStatus.SUSPENDED);
  }

  restore(): void {
    if (!this.isSuspended()) {
      throw new UserNotSuspendedException();
    }

    this.changeStatus(UserStatus.ACTIVE);
  }
}
