import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RESULT_STATUS } from 'libs/shared/src/lib/commons/enums';
import { UserSkillRequest } from './user-skill.request';
import { UserSkillResponse } from './user-skill.response';

@Resolver()
export class UserSkillResolver extends AitBaseService {

  @Query(() => UserSkillResponse, { name: 'findMSkillByFrom' })
  async findMSkillByFrom(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {  
      const user_id = request.user_id;
      const lang = request.lang;
      const from = request.condition._from as string;
      const collection = request.collection;
      if (user_id) {
      const aqlQuery = `
          FOR v,e, p IN 1..1 OUTBOUND "${from}" ${collection}
          FILTER  e.del_flag != true
          let skill = {_key: v.code, value:  v.name.${lang} ? v.name.${lang} : v.name}
          RETURN {_key: v._key, skills:skill} 
      `;
      const result = await this.query(aqlQuery);
      return await this.query(aqlQuery);
      } else {
      return new UserSkillResponse(RESULT_STATUS.ERROR, [], 'error');
      }
  }

  @Query(() => UserSkillResponse, { name: 'findUserSkill' })
  findUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => UserSkillResponse, { name: 'saveUserSkill' })
  saveUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserSkillResponse, { name: 'removeSkill' })
  async removeSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    // return this.remove(request, user);
    const user_id = request.user_id;

    if (user_id) {
      const aqlQuery = `
      FOR data IN user_skill
      REMOVE data._key IN user_skill
      LET removed = OLD
      RETURN removed
      `;
      return await this.query(aqlQuery);
    } else {
      return new UserSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Mutation(() => UserSkillResponse, { name: 'removeUserSkill' })
  async removeUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    //return this.remove(request, user);
    const user_id = request.user_id;
    const from = JSON.stringify(request.data[0]._from);
    if (user_id) {
      const aqlQuery = `
        FOR data IN user_skill
        FILTER data._from == ${from}
        UPDATE data WITH { del_flag: true } IN user_skill
        RETURN data
      `;
      console.log(aqlQuery);
      
      return await this.query(aqlQuery);
    } else {
      return new UserSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }
}
