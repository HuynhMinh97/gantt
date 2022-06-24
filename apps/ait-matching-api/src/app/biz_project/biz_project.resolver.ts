import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { getAdvancedMM, RESULT_STATUS } from '@ait/shared';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetProjectInforEntity } from './biz_project.entity';
import {
  BizProjectRequest,
  BizProjectDetailRequest,
  GetBizProjectInfoRequest,
  BizProjectDetailSaveRequest,
  BizProjectSkillRequest,
  BizProjectUserRequest,
} from './biz_project.request';
import {
  BizProjectDetailResponse,
  BizProjectResponse,
  BizProjectSkillResponse,
  BizProjectUserResponse,
  GetBizProjectInforResponse,
  PlanResponse,
} from './biz_project.response';

@Resolver()
export class BizProjectResolver extends AitBaseService {
  private monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  @Query(() => BizProjectUserResponse, { name: 'getPlan' })
  async getPlan(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectUserRequest })
    request: BizProjectUserRequest
  ) {
    return await this.find(request, user);
  }

  @Query(() => PlanResponse, { name: 'findPlan' })
  async findPlan(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const thisMonth = this.getMonth();
    const thisYear = new Date().getFullYear();
    const planObj = [];
    const monthObj = [];
    [...Array(3)].forEach((e, i) => {
      planObj.push({
        _key: thisMonth + i + 1,
        value: this.monthShortNames[thisMonth + i],
        mm: 0,
      });
      monthObj.push(thisMonth + i + 1);
    });
    const userId = 'sys_user/' + request.condition?.user_id;
    const aqlStr = `
    FOR data IN biz_project_user
      FILTER data._to == "${userId}" &&
             LENGTH(data.start_plan) > 0 &&
             DATE_YEAR(data.start_plan) == ${thisYear}
      RETURN data
    `;
    const res = await this.query(aqlStr);
    const data = (res.data || []).filter((e: { start_plan: number }) =>
      monthObj.includes(this.getMonth(e.start_plan))
    );
    if (data.length > 0) {
      data.forEach((e: { start_plan: number; end_plan: number }) => {
        const startMonth = this.getMonth(e.start_plan);
        const endMonth = this.getMonth(e.end_plan);
        const index = planObj.findIndex(({ _key }) => _key === startMonth);
        if (!startMonth || !endMonth) {
          return;
        }
        if (startMonth === endMonth) {
          const mm = this.getSimpleMM(e);
          planObj[index].mm += mm;
        } else {
          getAdvancedMM(e, planObj, monthObj);
        }
      });
      return new PlanResponse(200, planObj, '');
    } else {
      return new PlanResponse(200, planObj, '');
    }
  }

  getSimpleMM(data: any): number {
    const { hour_plan, manday_plan, manmonth_plan } = data;
    if (manmonth_plan) {
      return manmonth_plan;
    }
    if (manday_plan) {
      return manday_plan / 20;
    }
    if (hour_plan) {
      return hour_plan / 160;
    }
    return 0;
  }

  getMonth(date = 0): number {
    try {
      if (date) {
        return new Date(date).getMonth() + 1;
      } else {
        return new Date().getMonth() + 1;
      }
    } catch {
      return null;
    }
  }

  isCurrentYear(date: number): boolean {
    return new Date().getFullYear() === new Date(date).getFullYear();
  }

  @Query(() => BizProjectDetailResponse, { name: 'findBizProjectDetail' })
  async findBizProjectDetail(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectDetailRequest })
    request: BizProjectDetailRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => BizProjectResponse, { name: 'saveBizProject' })
  async saveBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const saveSkill = [];
    const requestSaveSkill = { ...request };
    requestSaveSkill.data = [];
    const arrSkill = request.data[0]?.skills || [];
    if (arrSkill.length > 0) {
      delete request.data[0]?.skills;
    }
    const res = await this.save(request, user);
    if (res.status === RESULT_STATUS.OK) {
      const projectKey = res.data[0]?._key || '';
      if (Array.isArray(arrSkill) && arrSkill.length > 0 && projectKey) {
        arrSkill.forEach((e) =>
          saveSkill.push({
            _from: `biz_project/${projectKey}`,
            _to: `m_skill/${e}`,
            level: 1,
          })
        );
        requestSaveSkill.data = saveSkill;
        requestSaveSkill.collection = 'biz_project_skill';
        this.save(requestSaveSkill, user);
      }
    }
    return res;
  }

  @Mutation(() => BizProjectDetailResponse, { name: 'saveBizProjectDetail' })
  saveBizProjectDetail(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectDetailSaveRequest })
    request: BizProjectDetailSaveRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => BizProjectUserResponse, { name: 'savePlan' })
  savePlan(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectUserRequest })
    request: BizProjectUserRequest
  ) {
    console.log(request);
    return this.save(request, user);
  }

  @Query(() => BizProjectResponse, { name: 'findProjectAitByKey' })
  async findProjectAitByKey(
    @Args('request', { type: () => GetBizProjectInfoRequest })
    request: GetBizProjectInfoRequest
  ) {
    return await this.find(request);
  }

  @Query(() => BizProjectSkillResponse, { name: 'findBizProjectSkillByFrom' })
  async findBizProjectSkillByFrom(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectSkillRequest })
    request: BizProjectSkillRequest
  ) {
    const lang = request.lang;
    const from = request.condition._from as string;
    const collection = request.collection;

    const aqlQuery = `
      FOR v,e, p IN 1..1 OUTBOUND "${from}" ${collection}
      FILTER  e.del_flag != true
      let skill = {_key: v._key, value:  v.name.${lang} ? v.name.${lang} : v.name}
      RETURN {_key: v._key, skill:skill, level: e.level} 
      `;
    const result = await this.query(aqlQuery);
    return result;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findSkillProject' })
  async findSkillProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GetBizProjectInfoRequest })
    request: GetBizProjectInfoRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection;
    const aqlQuery = `
      FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.skills
    `;
    const result = await this.query(aqlQuery);
    const Skills = [];
    if (result.data[0]) {
      for (const skill of result.data[0]) {
        const skillName = await this.getNameByKey(skill, lang, collection);
        const skills = {
          _key: skill,
          value: skillName.data[0],
        };
        Skills.push({ skills });
      }
    } else {
      const skills = {
        _key: null,
        value: null,
      };
      Skills.push({ skills });
    }

    const response = new GetBizProjectInforResponse(
      200,
      Skills as GetProjectInforEntity[],
      ''
    );

    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findTitleProject' })
  async findTitleProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection;

    const aqlQuery = `
      FOR v IN biz_project
      filter v._key == "${_key}"
      RETURN v.title
      `;
    const result = await this.query(aqlQuery);

    const Titles = [];

    if (result.data[0]) {
      for (const item of result.data[0]) {
        const titleName = await this.getNameByKey(item, lang, collection);
        const title = {
          _key: item,
          value: titleName.data[0],
        };
        Titles.push({ title });
      }
    } else {
      const titles = {
        _key: null,
        value: null,
      };
      Titles.push({ titles });
    }
    const response = new GetBizProjectInforResponse(
      200,
      Titles as GetProjectInforEntity[],
      ''
    );

    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findIndustryProject' })
  async findIndustryProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection;

    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.industry
    `;
    const result = await this.query(aqlQuery);

    const Industry = [];

    if (result.data[0]) {
      for (const item of result.data[0]) {
        const Name = await this.getNameByKey(item, lang, collection);
        const industry = {
          _key: item,
          value: Name.data[0],
        };
        Industry.push({ industry });
      }
    } else {
      const industry = {
        _key: null,
        value: null,
      };
      Industry.push({ industry });
    }

    const response = new GetBizProjectInforResponse(
      200,
      Industry as GetProjectInforEntity[],
      ''
    );

    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findLevelProject' })
  async findLevelProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection;

    const aqlQuery = `
      FOR v IN biz_project
      filter v._key == "${_key}"
      RETURN v.level
      `;
    const result = await this.query(aqlQuery);

    const Level = [];

    if (result.data[0]) {
      for (const item of result.data[0]) {
        const Name = await this.getNameByKey(item, lang, collection);
        const level = {
          _key: item,
          value: Name.data[0],
        };
        Level.push({ level });
      }
    } else {
      const level = {
        _key: null,
        value: null,
      };
      Level.push({ level });
    }

    const response = new GetBizProjectInforResponse(
      200,
      Level as GetProjectInforEntity[],
      ''
    );

    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findLocationProject' })
  async findLocationProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection;

    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.location
    `;
    const result = await this.query(aqlQuery);

    const Location = [];

    if (result.data[0]) {
      for (const item of result.data[0]) {
        const Name = await this.getNameByKey(item, lang, collection);
        const location = {
          _key: item,
          value: Name.data[0],
        };
        Location.push({ location });
      }
    } else {
      const location = {
        _key: null,
        value: null,
      };
      Location.push({ location });
    }

    const response = new GetBizProjectInforResponse(
      200,
      Location as GetProjectInforEntity[],
      ''
    );

    return response;
  }

  async getNameByKey(_key: string, lang: string, collection: string) {
    const aqlQuery = `
      FOR v IN ${collection}
      filter v._key == "${_key}"
      RETURN v.name.${lang}
      `;

    return await this.query(aqlQuery);
  }

  @Mutation(() => BizProjectSkillResponse, {
    name: 'removeBizProjectSkillByKey',
  })
  async removeBizProjectSkillByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectSkillRequest })
    request: BizProjectSkillRequest
  ) {
    const user_id = request.user_id;
    const from = JSON.stringify(request.data[0]._from);
    if (user_id) {
      const aqlQuery = `
        FOR data IN biz_project_skill
        FILTER data._from == ${from}
        REMOVE { _key: data._key } IN biz_project_skill
        LET removed = OLD
        RETURN removed
        `;
      return await this.query(aqlQuery);
    } else {
      return new BizProjectSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Mutation(() => BizProjectUserResponse, {
    name: 'removeBizProjectUser',
  })
  async removeBizProjectUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectUserRequest })
    request: BizProjectUserRequest
  ) {
    const _from = request.data[0]._from;
    const _to = request.data[0]._to;
    const aqlQuery = `
      FOR data IN biz_project_user
        FILTER  data._from == "${_from}" &&
                data._to == "${_to}"
        REMOVE { _key: data._key } IN biz_project_user
        LET removed = OLD
        RETURN removed
        `;
    return await this.query(aqlQuery);
  }

  @Mutation(() => BizProjectSkillResponse, { name: 'saveBizProjectSkill' })
  saveBizProjectSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectSkillRequest })
    request: BizProjectSkillRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => BizProjectResponse, {
    name: 'removeBizProjectByKey',
  })
  async removeBizProjectByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const _key = request.data[0]?._key;
    if (_key) {
      const aqlQuery = `
        FOR data IN biz_project
        FILTER data._key == "${_key}"
        UPDATE data WITH { del_flag: true } IN biz_project
        RETURN data
        `;

      return await this.query(aqlQuery);
    } else {
      return new BizProjectSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Mutation(() => BizProjectDetailResponse, {
    name: 'removeBizProjectDetailByKey',
  })
  async removeBizProjectDetailByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectDetailRequest })
    request: BizProjectDetailRequest
  ) {
    const project = request.data[0]?._key;
    if (project) {
      const aqlQuery = `
        FOR data IN biz_project_detail
        FILTER data.project == "${project}"
        UPDATE data WITH { del_flag: true } IN biz_project_detail
        RETURN data
        `;
      return await this.query(aqlQuery);
    } else {
      return new BizProjectSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }

  @Query(() => BizProjectResponse, { name: 'findBizProject' })
  async findBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const { company, lang } = request;
    const aqlStr = `
    LET current_data = ( 
      FOR data IN biz_project 
      FILTER data.company == "${company}" && 
      data.del_flag != true 
      RETURN MERGE(
      data, {
       name:  data.name.${lang} ? data.name.${lang} : IS_STRING(data.name) == true ? data.name : "", 
     
      create_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.create_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.create_by)
      )[0] : data.create_by
      ), 
      change_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.change_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.change_by)
      )[0] : data.change_by
      ),
      create_by : (
      IS_ARRAY(data.create_by) == true ? (
      FOR doc IN user_profile
      FILTER doc.user_id IN TO_ARRAY(data.create_by)
      RETURN
       doc.name  ) :
       (FOR doc IN user_profile
       FILTER doc.user_id == data.create_by
      RETURN
      doc.name )[0] ),
      change_by : (
      IS_ARRAY(data.change_by) == true ? (
      FOR doc IN user_profile
      FILTER doc.user_id IN TO_ARRAY(data.change_by)
      RETURN
       doc.name  ) :
       (FOR doc IN user_profile
       FILTER doc.user_id == data.change_by
      RETURN
      doc.name )[0] ),
      industry : (
      IS_ARRAY(data.industry) == true ? (
      FOR doc IN m_industry
      FILTER doc._key IN TO_ARRAY(data.industry)
      RETURN
      { _key: doc._key, value: doc.name.${lang} } ) :
       (FOR doc IN m_industry
       FILTER doc._key == data.industry
      RETURN
      { _key: doc._key, value: doc.name.${lang} })[0] ),
      title : (
      IS_ARRAY(data.title) == true ? (
      FOR doc IN m_title
      FILTER doc._key IN TO_ARRAY(data.title)
      RETURN
      { _key: doc._key, value: doc.name.${lang} } ) :
       (FOR doc IN m_title
       FILTER doc._key == data.title
      RETURN
      { _key: doc._key, value: doc.name.${lang} })[0] ),
      level : (
      IS_ARRAY(data.level) == true ? (
      FOR doc IN sys_master_data
      FILTER doc._key IN TO_ARRAY(data.level)
      RETURN
      { _key: doc._key, value: doc.name.${lang} } ) :
       (FOR doc IN sys_master_data
       FILTER doc._key == data.level
      RETURN
      { _key: doc._key, value: doc.name.${lang} })[0] ),
      location : (
      IS_ARRAY(data.location) == true ? (
      FOR doc IN sys_master_data
      FILTER doc._key IN TO_ARRAY(data.location)
      RETURN
      { _key: doc._key, value: doc.name.${lang} } ) :
       (FOR doc IN sys_master_data
       FILTER doc._key == data.location
      RETURN
      { _key: doc._key, value: doc.name.${lang} })[0] ),
      skills : (
        FOR v,e, p IN 1..1 OUTBOUND CONCAT("biz_project/", data._key) biz_project_skill
        FILTER  e.del_flag != true
        RETURN {_key: v._key, value:  v.name.ja_JP ? v.name.ja_JP : v.name, level: e.level}
     ),
      project_code: (
          FOR doc IN biz_project_detail
          FILTER doc.project == data._key
          RETURN doc.project_code
          )[0],
          status: (
            let z = (
              FOR doc IN biz_project_detail
                        FILTER doc.project == data._key
                        RETURN doc.status)[0]
              RETURN (
              LENGTH(z) > 0 ? (
                  for doc IN sys_master_data
                  filter doc.class == "PROJECT_STATUS" &&
                  doc._key == z
                  RETURN doc.name.${lang}
              )[0] : null)
          )[0]
    })
     )
     
     LET result = LENGTH(current_data) > 0 ? current_data : (
      FOR data IN biz_project
      FILTER data.company == "000000000000000000000000000000000000" &&
      data.del_flag != true
      RETURN MERGE(
      data, {
       name:  data.name.${lang} ? data.name.${lang} : IS_STRING(data.name) == true ? data.name : "",
     
      create_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.create_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.create_by)
      )[0] : data.create_by
      ),
      change_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.change_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.change_by)
      )[0] : data.change_by
      ),
      create_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.create_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.create_by)
      )[0] : data.create_by
      ),
      change_by: (
      data.is_matching != true ? (
      LET item = (
      FOR record IN user_profile
      FILTER record.user_id == data.change_by
      RETURN record
      )[0]
      RETURN (LENGTH(item.first_name > 0) ? CONCAT(item.first_name, " ", item.last_name) : data.change_by)
      )[0] : data.change_by
      ),   })
     )
     
     FOR data IN result
      FILTER
      LOWER(data.create_by) LIKE LOWER(CONCAT("%", TRIM(""), "%"))
      &&
      LOWER(data.change_by) LIKE LOWER(CONCAT("%", TRIM(""), "%"))
      RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : IS_STRING(data.name) == true ? data.name : "" })
    `;
    return this.query(aqlStr);
  }
}
