import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RESULT_STATUS } from 'libs/shared/src/lib/commons/enums';
import { ReorderSkillResponse } from './reorde-skill.response';
import { ReorderSkillRequest } from './reorder-skill.request';

@Resolver()
export class ReorderSkillResolver extends AitBaseService {

  @Query(() => ReorderSkillResponse, { name: 'findReorder' })
  findReorder(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ReorderSkillRequest }) request: ReorderSkillRequest
  ) {
    return this.find(request, user);
  }

  //tim theo egde 
  @Query(() => ReorderSkillResponse, { name: 'findReorderSkill' })
  async findReorderSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ReorderSkillRequest }) request: ReorderSkillRequest
  ) {
    const user_id = request.user_id;
    const lang = request.lang;
    const from = request.condition._from as string;
    const collection = request.collection;
    if (user_id) {
      const aqlQuery = `
      FOR data, e, p IN 1..1 OUTBOUND "${from}" ${collection}
      FILTER e.del_flag != true
      RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name })
    `;
      return await this.query(aqlQuery);

    } else {
      return new ReorderSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Mutation(() => ReorderSkillResponse, { name: 'saveUserSkillReorder' })
  saveUserSkillReorder(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ReorderSkillRequest }) request: ReorderSkillRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => ReorderSkillResponse, { name: 'UpdateTopSkill' })
  async UpdateTopSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ReorderSkillRequest }) request: ReorderSkillRequest
  ) {
    const user_id = request.user_id;
    if (user_id) {
      const user_id = JSON.stringify(request.user_id);
      const topSkill = JSON.stringify(request.data[0].top_skills);
      console.log(JSON.stringify(request.data[0].top_skills));
      
  
      const aqlQuery = `
      FOR data IN user_profile
      FILTER data.user_id == ${user_id}
      UPDATE data WITH { top_skills:${topSkill} } IN user_profile
      RETURN data.top_skills
    `;
      return await this.query(aqlQuery);
    } else {
      return new ReorderSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }
}
