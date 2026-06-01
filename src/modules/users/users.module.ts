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

@Module({
  imports: [PrismaModule],
  providers: [
    FindUserByIdFeature,
    FindUserByEmailFeature,
    UpdateUserEmailFeature,
    ChangeUserRoleFeature,
    ActivateUserFeature,
    DeactivateUserFeature,
    SuspendUserFeature,
    RestoreUserFeature,
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
