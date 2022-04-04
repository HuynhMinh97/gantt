import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { KEYS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import {
  SaveRecommendUserRequest,
  SkillForUserRequest,
} from './save-recommend-user.request';
import {
  SaveRecommendUserResponse,
  SkillForUserResponse,
} from './save-recommend-user.response';

@Resolver()
export class SaveRecommendUserResolver extends AitBaseService {
  collection = 'save-recommend-user';

  @Query(() => SaveRecommendUserResponse, { name: 'findSaveRecommendUser' })
  findSaveRecommendUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => SkillForUserResponse, { name: 'findSkillForUser' })
  findSkillForUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillForUserRequest })
    request: SkillForUserRequest
  ) {
    const lang = request.lang;
    const id = request.condition[KEYS.ID];
    const aqlStr = `
      FOR v,e, p IN 1..1 OUTBOUND "sys_user/${id}" user_skill
      RETURN v.name.${lang}
      `;
    return this.query(aqlStr);
  }

  @Mutation(() => SaveRecommendUserResponse, { name: 'saveRecommendUser' })
  saveRecommendUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    this.initialize(request, user);
    const dataSave = {};
    this.setCommonInsert(dataSave);
    dataSave['_from'] = 'sys-user/' + request.data[0]['_from'];
    dataSave['_to'] = 'sys-user/' + request.data[0]['_to'];

    const aqlStr = `FOR data IN ${JSON.stringify([dataSave] || [])}
    INSERT data INTO save_recommenced_user RETURN data`;
    return this.query(aqlStr);
  }

  @Mutation(() => SaveRecommendUserResponse, {
    name: 'removeSaveRecommendUser',
  })
  removeSaveRecommendUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    return this.remove(request, user);
  }
}
