import { Module } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { UserFinderService } from './application/services/user-finder.service';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { UpdateUserEmailUseCase } from './application/use-cases/update-user-email.use-case';
import { ChangeUserRoleUseCase } from './application/use-cases/change-user-role.use-case';
import { ActivateUserUseCase } from './application/use-cases/activate-user.use-case';
import { DeactivateUserUseCase } from './application/use-cases/deactivate-user.use-case';
import { SuspendUserUseCase } from './application/use-cases/suspend-user.use-case';
import { RestoreUserUseCase } from './application/use-cases/restore-user.use-case';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UserFinderService,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    UpdateUserEmailUseCase,
    ChangeUserRoleUseCase,
    ActivateUserUseCase,
    DeactivateUserUseCase,
    SuspendUserUseCase,
    RestoreUserUseCase,
  ],
})
export class UsersModule {}
