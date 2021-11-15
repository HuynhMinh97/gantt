/* eslint-disable @typescript-eslint/no-explicit-any */
import { COLLECTIONS, RESULT_STATUS } from '@ait/shared';
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
export class UserSettingResolver extends AitBaseService {
  constructor(db: Database, env: any) {
    super(db, env);
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
  // @UseGuards(GqlAuthGuard)
  saveUserSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    return this.saveSetting(request, user);
  }

  @Mutation(() => UserSettingResponse, { name: 'removeUserSetting' })
  @UseGuards(GqlAuthGuard)
  removeUserSetting(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    return this.remove(request, user);
  }

  private async saveSetting(request: UserSettingRequest, user: SysUser) {
    this.initialize(request, user);
    const collection = request.collection;
    const lang = request.lang;

    const dataInsert = [];
    const dataUpdate = [];
    const data = request.data[0];
    const findAql = `FOR doc IN user_setting FILTER doc.user_id == "${data.user_id}" RETURN doc`;

    const result = await this.query(findAql);
    let aqlStr = ``;
    
    if (result.status === RESULT_STATUS.OK) {
      if (result.data.length > 0) {
        this.setCommonUpdate(data);
        data._key = result.data[0]._key;
        dataUpdate.push(data);
  
        aqlStr = `FOR data IN ${JSON.stringify(dataUpdate)}
        UPDATE data WITH data IN ${collection} RETURN NEW `;
      } else {
        this.setCommonInsert(data);
        dataInsert.push(data);
        aqlStr = `FOR data IN ${JSON.stringify(dataInsert)}
        INSERT data INTO ${collection} RETURN MERGE(data, {name: data.name.${lang} ? data.name.${lang} : data.name }) `;
      }
      return await this.query(aqlStr);
    } else {
      return new UserSettingResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }
}
