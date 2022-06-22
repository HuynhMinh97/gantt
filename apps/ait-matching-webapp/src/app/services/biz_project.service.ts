/* eslint-disable @typescript-eslint/no-explicit-any */
import { KEYS } from '@ait/shared';
import { AitAppUtils, AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BizProjectService extends AitBaseService {
  collection = 'biz_project';
  detail = 'biz_project_detail';
  specialFields = ['skills', 'title', 'location', 'industry', 'level'];
  data_save = [];
  returnFields = {
    _key: true,
    name: true,
    keyword: true,
    skills: {
      _key: true,
      value: true,
    },
    title: {
      _key: true,
      value: true,
    },
    location: {
      _key: true,
      value: true,
    },
    industry: {
      _key: true,
      value: true,
    },
    level: {
      _key: true,
      value: true,
    },
    capacity_time_from: true,
    capacity_time_to: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
  };

  returnDetail = {
    _key: true,
    project: true,
    customer: {
      _key: true,
      value: true,
    },
    project_code: true,
    person_in_charge: true,
    status: {
      _key: true,
      value: true,
    },
    del_flag: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
  };

  async find(condition = {}) {
    condition[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    condition['location'] = {
      attribute: 'location',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['level'] = {
      attribute: 'level',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['skills'] = {
      attribute: 'skills',
      ref_collection: 'm_skill',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['industry'] = {
      attribute: 'industry',
      ref_collection: 'm_industry',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['create_by'] = {
      type: 'matching',
    };

    condition['change_by'] = {
      type: 'matching',
    };

    if (!condition['user_id']) {
      condition['user_id'] = this.user_id || '';
    }

    return await this.query(
      'findBizProject',
      {
        collection: this.collection,
        condition,
      },
      this.returnFields
    );
  }


  async findDetailByProject_key(project_key: string){
    const condition = {};
    condition['project']= project_key;
    condition['customer'] = {
      attribute: 'customer',
      ref_collection: 'm_company',
      ref_attribute: '_key',
      get_by: '_key',
    };

    condition['status'] = {
      attribute: 'status',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',get_by: '_key',
    };

    return await this.query(
      'findBizProjectDetail',
      {
        collection: this.detail,
        condition,
      },
      this.returnDetail
    );

  }

  async findDetail(condition = {}) {
    condition[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    condition['customer'] = {
      attribute: 'customer',
      ref_collection: 'm_company',
      ref_attribute: '_key',
    };

    condition['status'] = {
      attribute: 'status',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
    };

    condition['create_by'] = {
      type: 'matching',
    };

    condition['change_by'] = {
      type: 'matching',
    };

    if (!condition['user_id']) {
      condition['user_id'] = this.user_id || '';
    }

    return await this.query(
      'findBizProjectDetail',
      {
        collection: this.detail,
        condition,
      },
      this.returnDetail
    );
  }

  async save(data: any) {
    !data[KEYS.KEY] && delete data[KEYS.KEY];
    data[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    const returnField = { _key: true };
    return await this.mutation(
      'saveBizProject',
      this.collection,
      [data],
      returnField
    );
  }

  async saveBizProjectDetail(data: any){
    const returnField = { _key: true };
    return await this.mutation(
      'saveBizProjectDetail',
      'biz_project_detail',
      [data],
      returnField
    );
  }

  async remove(_key: string) {
    const returnFields = { _key: true };
    const data = { _key };
    return await this.mutation(
      'removeSearchCondition',
      this.collection,
      [data],
      returnFields
    );
  }

  async removeBizProjectSkill(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeBizProjectSkillByKey',
      'biz_project_skill',
      data,
      returnFields
    );
  }

  async saveBizProjectSkill(data: any[]) {
    const returnField = { _key: true, del_flag: true };
    return await this.mutation(
      'saveBizProjectSkill',
      'biz_project_skill',
      data,
      returnField
    );
  }


  async removeBizProjectByKey(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeBizProjectByKey',
      'biz_project',
      data,
      returnFields
    );
  }

  async removeBizProjectDetailByKey(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeBizProjectDetailByKey',
      'biz_project_detail',
      data,
      returnFields
    );
  }

  

  async findProjectAitByKey(_key?: string) {
    const returnFields = {
      _key: true,
      capacity_time_from: true,
      capacity_time_to: true,
      name: true,
      create_by: true,
      change_by: true,
      create_at: true,
      change_at: true,
      location: {
        _key: true,
        value: true,
      },
      title: {
        _key: true,
        value: true,
      },
      level: {
        _key: true,
        value: true,
      },
      industry: {
        _key: true,
        value: true,
      },
      remark: true,
      description: true,
    };
    const request = {};
    request['collection'] = 'biz_project';
    request['condition'] = {};
    request['condition']['industry'] = {
      attribute: 'industry',
      ref_collection: 'm_industry',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['skills'] = {
      attribute: 'skills',
      ref_collection: 'm_skill',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['level'] = {
      attribute: 'level',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
      // class: 'EMPLOYEE_LEVEL'
    };
    request['condition']['location'] = {
      attribute: 'location',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
      // class: 'EMPLOYEE_LEVEL'
    };

    request['condition']['_key'] = _key;
    request['condition']['create_by'] = {};
    request['condition']['change_by'] = {};
    request['condition']['create_by']['type'] = 'matching';
    request['condition']['change_by']['type'] = 'matching';
    return await this.query('findProjectAitByKey', request, returnFields);
  }

  async findSkillProject(_key: string) {
    const condition = {
      _from: 'biz_project/' + _key,
      del_flag: false,
    };
    return await this.query(
      'findBizProjectSkillByFrom',
      { collection: 'biz_project_skill', condition },
      {
        skill: {
          _key: true,
          value: true,
        },
        level: true
      }
    );
  }

  async findIndustryProject(_key: string) {
    const condition = {
      _key: _key,
      del_flag: false,
    };
    return await this.query(
      'findIndustryProject',
      { collection: 'm_industry', condition },
      {
        industry: {
          _key: true,
          value: true,
        },
      }
    );
  }

  async findLevelProject(_key: string) {
    const condition = {
      _key: _key,
      del_flag: false,
    };
    return await this.query(
      'findLevelProject',
      { collection: 'sys_master_data', condition },
      {
        level: {
          _key: true,
          value: true,
        },
      }
    );
  }

  async findTitleProject(_key: string) {
    const condition = {
      _key: _key,
      del_flag: false,
    };
    return await this.query(
      'findTitleProject',
      { collection: 'm_title', condition },
      {
        title: {
          _key: true,
          value: true,
        },
      }
    );
  }


  async findLocationProject(_key: string) {
    const condition = {
      _key: _key,
      del_flag: false,
    };
    return await this.query(
      'findLocationProject',
      { collection: 'sys_master_data', condition },
      {
        location: {
          _key: true,
          value: true,
        },
      }
    );
  }

  async getBizProjectUser(_key: string) {
    const condition = {
      _key: _key,
      del_flag: false,
    };
    return await this.query(
      'getBizProjectUser',
      {
        collection: 'biz_project_user',
        condition,
        options: { sort_by: { value: 'start_plan', order_by: 'ASC' } },
      },
      {
        first_name: true,
        last_name: true,
        start_plan: true,
        end_plan: true,
        hour_plan: true,
        manday_plan: true,
        manmonth_plan: true,
        remark: true,
        _key: true,
        user_id: true,
      }
    );
  }

  async findBizProjectUserByUser_id(user_id: string) {
    const condition = {
      user_id: user_id,
      del_flag: false,
    };
    return await this.query(
      'getBizProjectUser',
      {
        collection: 'biz_project_user',
        condition,
        options: { sort_by: { value: 'start_plan', order_by: 'ASC' } },
      },
      {
        first_name: true,
        last_name: true,
        start_plan: true,
        end_plan: true,
        hour_plan: true,
        manday_plan: true,
        manmonth_plan: true,
        remark: true,
        _key: true,
        user_id: true,
      }
    );
  }

  async saveTeamMember(data) {
    const _from = data['project_key'];
    const _to = data['user_id'];
    const returnField = {
      _key: true,
    };
    data['hour_plan'] = Number(data['hour_plan']);
    delete data['employee_name'];
    delete data['end_plan_format'];
    delete data['start_plan_format'];
    delete data['user_id'];
    delete data['project_key'];

    return await this.mutation(
      'saveTeamMember',
      'biz_project_user',
      [
        {
          ...data,
          _from,
          _to,
        },
      ],
      returnField
    );
  }
}
