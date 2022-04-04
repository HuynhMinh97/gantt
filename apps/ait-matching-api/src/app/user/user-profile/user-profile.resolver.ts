import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { RESULT_STATUS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserProfileRequest } from './user-profile.request';
import { UserProfileResponse as UserProfileResponse } from './user-profile.response';

@Resolver()
export class UserProfileResolver extends AitBaseService {

  @Query(() => UserProfileResponse, { name: 'findProfile' })
  findProfile(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    return this.find(request, user);
  }

  
  @Query(() => UserProfileResponse, { name: 'findFriends' })
  async findFriends(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
    ) {
    return this.find(request, user);
  }

  @Mutation(() => UserProfileResponse, { name: 'saveFriends' })
  saveFriends(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
      return this.save(request, user);
  }
  @Mutation(() => UserProfileResponse, { name: 'removeFriends' })
  async removeFriends(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
      //return this.remove(request, user);
      const user_id = request.user_id;
      const from = JSON.stringify(request.data[0]._from);
      const to = JSON.stringify(request.data[0]._to);
      if (user_id) {
      const aqlQuery = `
      FOR data IN reaction_love
      FILTER data._from == ${from} && data._to == ${to} && data.del_flag != true
      UPDATE data WITH { del_flag: true } IN reaction_love
      RETURN data
      `;
        console.log(aqlQuery);
        
      return await this.query(aqlQuery);
      } else {
      return new UserProfileResponse(RESULT_STATUS.ERROR, [], 'error');
      }
  }
  
  @Query(() => UserProfileResponse, { name: 'findProfileByCondition' })
  async findProfileByCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    const company = request.company;
    const lang = request.lang;

    const aqlStr = `
    LET current_data = (
      FOR data IN user_profile
      FILTER data.company == "${company}" &&
      data.del_flag != true
      RETURN MERGE(
      data, {
       name:  data.name.${lang} ? data.name.${lang} : data.name,
     
      company_working : (
      IS_ARRAY(data.company_working) == true ? (
      FOR doc IN m_company
      FILTER doc.code IN TO_ARRAY(data.company_working)
      RETURN
      { _key: doc.code, value: doc.name.${lang} } ) :
       (FOR doc IN m_company
       FILTER doc.code == data.company_working
      RETURN
      { _key: doc.code, value: doc.name.${lang} })[0] ),
      
      skills: (
      
      FOR v,e, p IN 1..1 OUTBOUND CONCAT("sys_user/",data.user_id) user_skill
           RETURN v.name.${lang}
      )
      })
     )
     
     LET result = LENGTH(current_data) > 0 ? current_data : (
      FOR data IN user_profile
      FILTER data.company == "000000000000000000000000000000000000" &&
      data.del_flag != true
      RETURN MERGE(
      data, {
       name:  data.name.${lang} ? data.name.${lang} : data.name,
       })
     )
     
     FOR data IN result
      RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name })
    `;

    return this.query(aqlStr);
  }
}
