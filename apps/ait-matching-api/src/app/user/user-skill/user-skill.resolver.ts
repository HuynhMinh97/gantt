import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RESULT_STATUS } from 'libs/shared/src/lib/commons/enums';
import { UserSkillRequest } from './user-skill.request';
import { UserSkillResponse } from './user-skill.response';

@Resolver()
export class UserSkillResolver extends AitBaseService {
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

  @Mutation(() => UserSkillResponse, { name: 'removeUserSkill' })
  async removeUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    //return this.remove(request, user);
    const user_id = request.user_id;

    if (user_id) {
      const aqlQuery = `
      FOR item IN user_skill
      FOR data IN user_skill
      FILTER data._from == item._from
      UPDATE data WITH { del_flag: true } IN user_skill
      RETURN data
    `;

      return await this.query(aqlQuery);
    } else {
      return new UserSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }
}
