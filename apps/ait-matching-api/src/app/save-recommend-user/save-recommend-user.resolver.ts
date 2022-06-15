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

  @Query(() => SkillForUserResponse, { name: 'findRecommendUser' })
  findRecommendUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillForUserRequest })
    request: SkillForUserRequest
  ) {
    const id = request.condition[KEYS.USER_ID];
    const aqlStr = `
      FOR v,e, p IN 1..1 OUTBOUND "sys_user/${id}" save_recommend_user
      RETURN v
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
    dataSave['_from'] = 'sys_user/' + request.data[0]['_from'];
    dataSave['_to'] = 'sys_user/' + request.data[0]['_to'];

    const aqlStr = `FOR data IN ${JSON.stringify([dataSave] || [])}
    INSERT data INTO save_recommend_user RETURN data`;
    return this.query(aqlStr);
  }

  @Mutation(() => SaveRecommendUserResponse, { name: 'saveTeamMember' })
  saveTeamMember(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    this.initialize(request, user);
    const dataSave = {};
    this.setCommonInsert(dataSave);
    dataSave['_from'] = 'biz_project/' + request.data[0]['_from'];
    dataSave['_to'] = 'sys_user/' + request.data[0]['_to'];
    const aqlStr = `FOR data IN ${JSON.stringify([dataSave] || [])}
    INSERT data INTO biz_project_user RETURN data`;
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
    const _from = request.data[0]._from;
    const _to = request.data[0]._to;

    const aqlStr = `
    FOR u IN save_recommend_user
      FILTER u._from == "${_from}"
      AND u._to == "${_to}"
      REMOVE { _key: u._key } IN save_recommend_user
      LET removed = OLD
    RETURN removed
    `;
    return this.query(aqlStr);
  }

  @Mutation(() => SaveRecommendUserResponse, {
    name: 'removeTeamMember',
  })
  removeTeamMember(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    const _from = request.data[0]._from;
    const _to = request.data[0]._to;

    const aqlStr = `
    FOR u IN biz_project_user
      FILTER u._from == "${_from}"
      AND u._to == "${_to}"
      REMOVE { _key: u._key } IN biz_project_user
      LET removed = OLD
    RETURN removed
    `;
    return this.query(aqlStr);
  }
}
