import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SkillListService extends AitBaseService {
  collection = 'm_skill';
  returnFields = {
    _key: true,
    sort_no: true,
    name: true,
    category: {
      _key: true,
      value: true,
    },
    create_by: true,
    change_by: true,
    create_at: true,
    change_at: true,
    active_flag: true,
  };

  async searchSkill(condition = {}) {
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    if (!condition['category'])
    {
      condition['category'] = {};
    }
    condition['category']['attribute'] = 'category';
    condition['category']['ref_collection'] = 'sys_master_data';
    condition['category']['ref_attribute'] = '_key';
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'searchSkill',
      {
        collection: this.collection,
        condition: condition,
        options: { sort_by: { value: 'sort_no', order_by: 'DESC' } },
      },
      this.returnFields
    );
  }

  removeSkillByKey = async (_key: string) => {
    const returnField = { _key: true };
    const data = { _key };
    return await this.mutation(
      'removeSkillByKey',
      this.collection,
      [data],
      returnField
    );
  };
}
