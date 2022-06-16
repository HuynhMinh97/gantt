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
    valid_time_from: true,
    valid_time_to: true,
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
}
