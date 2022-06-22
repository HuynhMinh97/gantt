import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { RESULT_STATUS } from '@ait/shared';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetProjectInforEntity } from './biz_project.entity';
import {
  BizProjectRequest,
  BizProjectDetailRequest,
  GetBizProjectInfoRequest,
  BizProjectDetailSaveRequest,
  BizProjectSkillRequest,
} from './biz_project.request';
import {
  BizProjectDetailResponse,
  BizProjectResponse,
  BizProjectSkillResponse,
  GetBizProjectInforResponse,
  PlanResponse,
} from './biz_project.response';
import moment from 'moment-business-days';

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
             DATE_YEAR(data.start_plan) == ${thisYear} &&
             DATE_MONTH(data.start_plan) IN TO_ARRAY(${JSON.stringify(
               monthObj
             )})
      RETURN data
    `;
    const res = await this.query(aqlStr);
    const data = res.data || [];
    if (data.length > 0) {
      data.forEach((e: { start_plan: number; end_plan: number }) => {
        const startMonth = this.getMonth(e.start_plan);
        const endMonth = this.getMonth(e.end_plan);
        const index = planObj.findIndex(({ _key }) => _key === startMonth);
        if (!startMonth || !endMonth) {
          return;
        }
        // 5919683581
        if (startMonth === endMonth) {
          const mm = this.getSimpleMM(e);
          planObj[index].mm += mm;
        } else {
          this.getAdvancedMM(e, planObj);
        }
      });
      console.log(planObj)
      return new PlanResponse(200, planObj, '');
    } else {
      return new PlanResponse(200, planObj, '');
    }
  }
  getAdvancedMM(data: any, planObj: any[]) {
    const {
      hour_plan,
      manday_plan,
      manmonth_plan,
      start_plan,
      end_plan,
    } = data;
    const diff = moment(end_plan).businessDiff(moment(start_plan));
    const d1 = moment(start_plan)
      .endOf('month')
      .businessDiff(moment(start_plan));
    const e1 = diff - d1;
    let d2 = 0;
    let d3 = 0;
    if (e1 <= 20 && e1 !== 0) {
      d2 = moment(end_plan).businessDiff(
        moment(start_plan).add(1, 'months').startOf('month')
      );
    } else if (e1 !== 0) {
      d2 = moment(start_plan)
        .add(1, 'months')
        .endOf('month')
        .businessDiff(moment(start_plan).add(1, 'months').startOf('month'));
      d3 = moment(end_plan).businessDiff(
        moment(start_plan).add(2, 'months').startOf('month')
      );
    }
    const sum = d1 + d2 + d3;
    if (manmonth_plan) {
      planObj[0].mm += (manmonth_plan / sum) * d1;
      planObj[1].mm += (manmonth_plan / sum) * d2;
      planObj[2].mm += (manmonth_plan / sum) * d3;
      return;
    }
    if (manday_plan) {
      planObj[0].mm += (manday_plan / 20 / sum) * d1;
      planObj[1].mm += (manday_plan / 20 / sum) * d2;
      planObj[2].mm += (manday_plan / 20 / sum) * d3;
      return;
    }
    if (hour_plan) {
      planObj[0].mm += (manday_plan / 160 / sum) * d1;
      planObj[1].mm += (manday_plan / 160 / sum) * d2;
      planObj[2].mm += (manday_plan / 160 / sum) * d3;
      return;
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

  @Query(() => BizProjectResponse, { name: 'findBizProject' })
  findBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.find(request, user);
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
  saveBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => BizProjectDetailResponse, { name: 'saveBizProjectDetail' })
  saveBizProjectDetail(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectDetailSaveRequest })
    request: BizProjectDetailSaveRequest
  ) {
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

  @Mutation(() => BizProjectSkillResponse, { name: 'saveBizProjectSkill' })
  saveBizProjectSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectSkillRequest })
    request: BizProjectSkillRequest
  ) {
    console.log(request)
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
  
}
