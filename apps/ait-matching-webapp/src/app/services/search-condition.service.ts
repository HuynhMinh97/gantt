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
  };

  async find(condition = {}) {
    condition[KEYS.USER_ID] = this.user_id || AitAppUtils.getUserId() || '';
    condition['location'] = {
      attribute: 'location',
      ref_collection: 'sys_master_data',
      ref_attribute: 'code',
    };

    condition['level'] = {
      attribute: 'level',
      ref_collection: 'sys_master_data',
      ref_attribute: 'code',
    };

    condition['skills'] = {
      attribute: 'skills',
      ref_collection: 'm_skill',
      ref_attribute: 'code',
    };

    condition['industry'] = {
      attribute: 'industry',
      ref_collection: 'm_industry',
      ref_attribute: 'code',
    };

    condition['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: 'code',
    };

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
