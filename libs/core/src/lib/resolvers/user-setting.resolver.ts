/* eslint-disable @typescript-eslint/no-explicit-any */
import { COLLECTIONS, isObjectFull, RESULT_STATUS } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { SysUser } from '../entities/sys-user.entity';
import { AitBaseService } from '../services/ait-base.service';
import {
  UserSettingCustomResponse,
  UserSettingResponse,
} from '../responses/user-setting.response';
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

  @Query(() => UserSettingCustomResponse, { name: 'findUserSettingCustom' })
  async findUserSettingCustom(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSettingRequest })
    request: UserSettingRequest
  ) {
    request['colection'] = this.collection;
    const lang = request['lang'];
    const settingResult = await this.find(request, user);
    const settingData = settingResult?.data[0];
    if (isObjectFull(settingData)) {
      const parentCode = [
        'DATE_FORMAT_INPUT',
        'DATE_FORMAT_DISPLAY',
        'NUMBER_FORMAT',
      ];
      const findAql = `FOR doc IN sys_master_data FILTER doc.parent_code IN ${JSON.stringify(
        parentCode
      )} RETURN doc`;
      const masterResult = await this.query(findAql);
      const masterData = masterResult?.data || [];
      const dateFormatDisplay = masterData.find(
        (item: any) => item.code === settingData.date_format_display
      );
      const dateFormatInput = masterData.find(
        (item: any) => item.code === settingData.date_format_input
      );
      const numberFormat = masterData.find(
        (item: any) => item.code === settingData.number_format
      );

      Object.assign(settingData, {
        date_format_display: {
          value: dateFormatDisplay['name'][lang],
          code: settingData.date_format_display,
        },
        date_format_input: {
          value: dateFormatInput['name'][lang],
          code: settingData.date_format_input,
        },
        number_format: {
          value: numberFormat['name'][lang],
          code: settingData.number_format,
        },
      });

      return settingResult;
    } else {
      return settingResult;
    }
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
