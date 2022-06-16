/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { RESULT_STATUS } from '@ait/shared';
import { Resolver, Args, Query } from '@nestjs/graphql';
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

  @Query(() => UserProfileResponse, { name: 'findUserByProject' })
  async findUserByProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    const projectId = request.condition['project_id'] || '';
    const aqlStr = `
      FOR v,e, p IN 1..1 OUTBOUND "biz_project/${projectId}" biz_project_user
      RETURN e
    `;
    const res = await this.query(aqlStr);
    const userIds = [];
    if (res.numData === 0) {
      return new UserProfileResponse(200, [], '');
    } else {
      const data = res.data;
      data.forEach((e: { _to: string }) => {
        if (e?._to) {
          userIds.push(e._to.substring(9));
        }
      });
      request.condition['list'] = userIds;
      request.condition['start'] = 0;
      request.condition['end'] = 9999999;
      return this.findProfileByList(user, request);
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
    const projectId = request.condition['project_id'] || '';
    const start = request.condition['start'];
    const end = request.condition['end'];
    const isSaved = !!request.condition['is_saved'];
    const isTeamMember = !!request.condition['is_team_member'];

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

    if (!isSaved && !isTeamMember) {
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

    const aqlStr3 = `
      FOR v,e, p IN 1..1 OUTBOUND "biz_project/${projectId}" biz_project_user
      RETURN e
    `;

    const res = await this.query(aqlStr1);
    if (res.status === RESULT_STATUS.OK && res.data?.length > 0) {
      const savedUser = await this.query(aqlStr2);
      const teamMember = await this.query(aqlStr3);
      const savedData: any[] = savedUser.data || [];
      const teamMemberData: any[] = teamMember.data || [];
      const data = [];
      res.data.forEach((e: any) => {
        const i = savedData.findIndex((z) => z._to === `sys_user/${e.user_id}`);
        const z = teamMemberData.findIndex(
          (z) => z._to === `sys_user/${e.user_id}`
        );
        if (isSaved) {
          if (i !== -1) {
            const temp = { ...e, is_saved: true, is_team_member: !!~z };
            data.push(temp);
          }
        } else if (isTeamMember) {
          if (z !== -1) {
            const temp = { ...e, is_saved: !!~i, is_team_member: true };
            data.push(temp);
          }
        } else {
          const temp = { ...e, is_saved: !!~i, is_team_member: !!~z };
          data.push(temp);
        }
      });
      return new UserProfileResponse(200, data, '');
    } else {
      return new UserProfileResponse(200, [], '');
    }
  }

  @Query(() => UserProfileResponse, { name: 'findProfileByList' })
  async findProfileByList(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest })
    request: UserProfileRequest
  ) {
    const company = request.company;
    const lang = request.lang;
    const userId = request.user_id || '';
    const projectId = request.condition['project_id'];
    const list = request.condition['list'];
    const start = request.condition['start'];
    const end = request.condition['end'];
    const isSaved = !!request.condition['is_saved'];
    const isTeamMember = !!request.condition['is_team_member'];

    const aqlStr1 = `
    LET current_data = (
      FOR data IN user_profile
      FILTER data.company == "${company}" &&
      data.user_id IN ${JSON.stringify(list)} &&
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
     
     FOR data IN result
     LIMIT ${+start}, ${+end}

    RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name })
    `;

    const aqlStr2 = `
      FOR v,e, p IN 1..1 OUTBOUND "sys_user/${userId}" save_recommend_user
      RETURN e
    `;

    const aqlStr3 = `
      FOR v,e, p IN 1..1 OUTBOUND "biz_project/${projectId}" biz_project_user
      RETURN e
    `;

    const res = await this.query(aqlStr1);
    if (res.status === RESULT_STATUS.OK && res.data?.length > 0) {
      const savedUser = await this.query(aqlStr2);
      const teamMember = await this.query(aqlStr3);
      const savedData: any[] = savedUser.data || [];
      const teamMemberData: any[] = teamMember.data || [];
      const data = [];
      res.data.forEach((e: any) => {
        const i = savedData.findIndex((z) => z._to === `sys_user/${e.user_id}`);
        const z = teamMemberData.findIndex(
          (z) => z._to === `sys_user/${e.user_id}`
        );
        if (isSaved) {
          if (i !== -1) {
            const temp = { ...e, is_saved: true, is_team_member: !!~z };
            data.push(temp);
          }
        } else if (isTeamMember) {
          if (z !== -1) {
            const temp = { ...e, is_saved: !!~i, is_team_member: true };
            data.push(temp);
          }
        } else {
          const temp = { ...e, is_saved: !!~i, is_team_member: !!~z };
          data.push(temp);
        }
      });
      return new UserProfileResponse(200, data, '');
    } else {
      return new UserProfileResponse(200, [], '');
    }
  }
}
