import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddSkillService extends AitBaseService {
  async getMaxSortNo(condition = {}) {
    condition['del_flag'] = false;
    condition['active_flag'] = true;
    return await this.query(
      'getMaxSortno',
      {
        collection: 'm_skill',
        condition,
      },

      { sort_no: true }
    );
  }
  async findCategoryByKey(category_key?: string) {
    const returnFields = {
      name: true,
    };
    const request = {};
    request['collection'] = 'sys_master_data';
    request['condition'] = {};
    request['condition']['_key'] = category_key;
    return await this.query('findCategoryByKey', request, returnFields);
  }

  async findSkillByKey(skill_key?: string) {
    const condition: any = {
      _key: skill_key,
    };
    const returnFields = {
      name: true,
      category: {
        _key: true,
        value: true,
      },
      create_at: true,
      change_at: true,
      create_by: true,
      change_by: true,
    };
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }
    condition['category'] = {
      attribute: 'category',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
    };

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';
    const request = {};
    request['collection'] = 'm_skill';
    request['condition'] = condition;
    return await this.query('findSkillByKey', request, returnFields);
  }

  async saveSkill(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSkillInMSkill',
      'm_skill',
      [data],
      returnField
    );
  }
}
