/* eslint-disable @typescript-eslint/no-explicit-any */
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
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => UserProfileResponse, { name: 'findFriends' })
  async findFriends(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => UserProfileResponse, { name: 'saveFriends' })
  saveFriends(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    return this.save(request, user);
  }
  @Mutation(() => UserProfileResponse, { name: 'removeFriends' })
  async removeFriends(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
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
      return await this.query(aqlQuery);
    } else {
      return new UserProfileResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Query(() => UserProfileResponse, { name: 'findProfileByCondition' })
  async findProfileByCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    const company = request.company;
    const lang = request.lang;
    const userId = request.user_id || '';
    const start = request.condition['start'];
    const end = request.condition['end'];
    const isSaved = !!request.condition['is_saved'];

    let aqlStr1 = `
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
        FILTER doc._key IN TO_ARRAY(data.company_working)
        RETURN
        { _key: doc.code, value: doc.name.${lang} } ) :
        (FOR doc IN m_company
        FILTER doc._key == data.company_working
        RETURN
        { _key: doc.code, value: doc.name.${lang} })[0] ),

      industry_working : (
        IS_ARRAY(data.industry_working) == true ? (
        FOR doc IN m_industry
        FILTER doc._key IN TO_ARRAY(data.industry_working)
        RETURN
        { _key: doc.code, value: doc.name.${lang} } ) :
         (FOR doc IN m_industry
         FILTER doc._key == data.industry_working
        RETURN
        { _key: doc.code, value: doc.name.${lang} })[0] ),

      current_job_title : (
        IS_ARRAY(data.current_job_title) == true ? (
        FOR doc IN m_title
        FILTER doc._key IN TO_ARRAY(data.current_job_title)
        RETURN
        { _key: doc.code, value: doc.name.${lang} } ) :
         (FOR doc IN m_title
         FILTER doc._key == data.current_job_title
        RETURN
        { _key: doc.code, value: doc.name.${lang} })[0] ),

      current_job_level : (
        IS_ARRAY(data.current_job_level) == true ? (
        FOR doc IN sys_master_data
        FILTER doc._key IN TO_ARRAY(data.current_job_level)
        RETURN
        { _key: doc.code, value: doc.name.${lang} } ) :
         (FOR doc IN sys_master_data
         FILTER doc._key == data.current_job_level
        RETURN
        { _key: doc.code, value: doc.name.${lang} })[0] ),

      province_city : (
        IS_ARRAY(data.province_city) == true ? (
        FOR doc IN sys_master_data
        FILTER doc._key IN TO_ARRAY(data.province_city)
        RETURN
        { _key: doc.code, value: doc.name.${lang} } ) :
         (FOR doc IN sys_master_data
         FILTER doc._key == data.province_city
        RETURN
        { _key: doc.code, value: doc.name.${lang} })[0] ),
      
      skills: (
      FOR v,e, p IN 1..1 OUTBOUND CONCAT("sys_user/",data.user_id) user_skill
           RETURN { _key: v._key, name: v.name.${lang}, level: e.level }
      )
      })
     )
     
     LET result = LENGTH(current_data) > 0 ? current_data : (
      FOR data IN user_profile
      FILTER data.company == "000000000000000000000000000000000000" &&
      data.del_flag != true
      RETURN MERGE(
      data, {
       name: data.name.${lang} ? data.name.${lang} : data.name,
       })
     )
     
     FOR data IN result `;

    if (!isSaved) {
      aqlStr1 += `
        LIMIT ${+start}, ${+end}
       `;
    }

    aqlStr1 += `
      RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name })
    `;

    const aqlStr2 = `
      FOR v,e, p IN 1..1 OUTBOUND "sys_user/${userId}" save_recommend_user
      RETURN e
    `;

    const res = await this.query(aqlStr1);
    if (res.status === RESULT_STATUS.OK && res.data?.length > 0) {
      const savedUser = await this.query(aqlStr2);
      const savedData: any[] = savedUser.data || [];
      const data = [];
      res.data.forEach((e: any) => {
        const i = savedData.findIndex((z) => z._to === `sys_user/${e.user_id}`);
        if (isSaved) {
          if (i !== -1) {
            const temp = { ...e, is_saved: true };
            data.push(temp);
          }
        } else {
          if (i !== -1) {
            const temp = { ...e, is_saved: true };
            data.push(temp);
          } else {
            const temp = { ...e, is_saved: false };
            data.push(temp);
          }
        }
      });
      return new UserProfileResponse(200, data, '');
    } else {
      return new UserProfileResponse(200, [], '');
    }
  }
}
