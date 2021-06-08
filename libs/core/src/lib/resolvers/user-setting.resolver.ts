import { COLLECTIONS } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { SysUser } from '../entities/sys-user.entity';
import { AitBaseService } from '../services/ait-base.service';
import { UserSettingResponse } from '../responses/user-setting.response';
import { UserSettingRequest } from '../requests/user-setting.request';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserSettingResolver extends AitBaseService {
  constructor(db: Database) {
    super(db);
  }
  collection: string = COLLECTIONS.USER_SETTING;

  @Query(() => UserSettingResponse, { name: 'findUserSetting' })
  findUserSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    return this.find(request, user);
  }

  @Mutation(() => UserSettingResponse, { name: 'saveUserSetting' })
  saveUserSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    return this.save(request, user);
  }

  @Mutation(() => UserSettingResponse, { name: 'removeUserSetting' })
  removeUserSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    return this.remove(request, user);
  }
}
