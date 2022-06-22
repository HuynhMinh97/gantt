import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { KEYS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SaveRecommendUserEntity } from './save-recommend-user.entity';
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
    
    
    
    const dataSave = {...request.data[0]};
    delete dataSave['_from'];
    delete dataSave['_to'];
    
    
    dataSave['_from'] = 'biz_project/' + request.data[0]['_from'];
    dataSave['_to'] = 'sys_user/' + request.data[0]['_to'];
    console.log(dataSave)
    if (!dataSave['_key']){
      this.setCommonInsert(dataSave);
      const aqlStr = `FOR data IN ${JSON.stringify([dataSave] || [])}
      INSERT data INTO biz_project_user RETURN data`;
      return this.query(aqlStr);
    }else {
      const aqlStr = `FOR data IN ${JSON.stringify([dataSave] || [])}
      UPDATE data WITH data IN biz_project_user RETURN data._key`;
      console.log(aqlStr)
      return this.query(aqlStr);
    }
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


  @Query(() => SaveRecommendUserResponse, { name: 'getBizProjectUser' })
  async getBizProjectUser(
    @Args('request', { type: () => SaveRecommendUserRequest })
    request: SaveRecommendUserRequest
  ) {
    const biz_project_key = request.condition?._key
    delete request.condition?._key;
    const _from = 'biz_project/' + biz_project_key;
    const aqlQuery = `
    FOR a,e,v IN 1..1 OUTBOUND "${_from}" biz_project_user
        RETURN e`
    const result = await this.query(aqlQuery);
    const listData = result.data;
    
    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const userArr = [];
    for (const data of listData) {
      const user_id = data._to.split("/").splice(1,1);
      
      let first_name = '';
      let last_name = '';
      for (const user of userList) {
        
        if (user.user_id == user_id) {
          first_name = user.first_name;
          last_name = user.last_name;
          
          break;
        }
      }
          userArr.push({
            ...data,
            first_name: first_name,
            last_name: last_name,
            user_id : user_id[0],
          });
        
    }
    const response = new SaveRecommendUserResponse(
      200,
      userArr as SaveRecommendUserEntity[],
      ''
    );
    return response;
  }

 
}
