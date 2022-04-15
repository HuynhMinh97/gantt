/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArrayFull, KEYS, Utils } from '@ait/shared';
import { AitAppUtils, AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchConditionService extends AitBaseService {
  collection = 'save_recommend_user_query';
  specialFields = ['skills', 'title', 'location', 'industry', 'level'];
  returnFields = {
    _key: true,
    name: true,
    keyword: true,
    skills: {
      _key: true,
      value: true,
    },
    current_job_title: {
      _key: true,
      value: true,
    },
    province_city: {
      _key: true,
      value: true,
    },
    industry_working: {
      _key: true,
      value: true,
    },
    current_job_level: {
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

  async find(condition = {}) {
    condition[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    condition['province_city'] = {
      attribute: 'province_city',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
    };

    condition['current_job_level'] = {
      attribute: 'current_job_level',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
    };

    condition['skills'] = {
      attribute: 'skills',
      ref_collection: 'm_skill',
      ref_attribute: '_key',
      get_by: '_key'
    };

    condition['industry_working'] = {
      attribute: 'industry_working',
      ref_collection: 'm_industry',
      ref_attribute: '_key',
    };

    condition['current_job_title'] = {
      attribute: 'current_job_title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
    };

    condition['create_by'] = {
      type: 'matching'
    };

    condition['change_by'] = {
      type: 'matching'
    }
    
    if (!condition['user_id']) {
      condition['user_id'] = this.user_id || '';
    }

    return await this.query(
      'findSearchCondition',
      {
        collection: this.collection,
        condition,
      },
      this.returnFields
    );
  }

  async save(data: any) {
    this.specialFields.forEach((e) => {
      if (isArrayFull(data[e])) {
        data[e] = Utils.getKeys(data[e]);
      }
    });
    !data[KEYS.KEY] && delete data[KEYS.KEY];
    data[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    const returnField = { _key: true };
    console.log(data);return
    return await this.mutation(
      'saveSearchCondition',
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
