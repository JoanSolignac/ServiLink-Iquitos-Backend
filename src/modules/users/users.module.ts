import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FindUserByIdFeature } from './features/find-user-by-id.feature';
import { FindUserByEmailFeature } from './features/find-user-by-email.feature';
import { UpdateUserEmailFeature } from './features/update-user-email.feature';
import { ChangeUserRoleFeature } from './features/change-user-role.feature';
import { ActivateUserFeature } from './features/activate-user.feature';
import { DeactivateUserFeature } from './features/deactivate-user.feature';
import { SuspendUserFeature } from './features/suspend-user.feature';
import { RestoreUserFeature } from './features/restore-user.feature';
import { ListUsersFeature } from './features/list-users.feature';
import { CheckEmailExistsFeature } from './features/check-email-exists.feature';
import { BanUserFeature } from './features/ban-user.feature';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    FindUserByIdFeature,
    FindUserByEmailFeature,
    UpdateUserEmailFeature,
    ChangeUserRoleFeature,
    ActivateUserFeature,
    DeactivateUserFeature,
    SuspendUserFeature,
    RestoreUserFeature,
    ListUsersFeature,
    CheckEmailExistsFeature,
    BanUserFeature,
  ],
  exports: [
    FindUserByIdFeature,
    FindUserByEmailFeature,
    UpdateUserEmailFeature,
    ChangeUserRoleFeature,
    ActivateUserFeature,
    DeactivateUserFeature,
    SuspendUserFeature,
    RestoreUserFeature,
  ],
})
export class UsersModule {}
