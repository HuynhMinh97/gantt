import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageListService extends AitBaseService {
  collection = 'user_language';
  async find(condition = {}) {
    condition['del_flag'] = false;

    if (!condition['language']){
      condition['language'] = {}
    }
    condition['language']['attribute'] = 'language';
    condition['language']['ref_collection'] = 'sys_master_data';
    condition['language']['ref_attribute'] = '_key';

    if (!condition['proficiency']){
      condition['proficiency'] = {}
    }
    condition['proficiency']['attribute'] = 'proficiency';
    condition['proficiency']['ref_collection'] = 'sys_master_data';
    condition['proficiency']['ref_attribute'] = '_key';

    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'getlanguageList',
      {
        collection: this.collection,
        condition,
        options: { sort_by: { value: 'first_name', order_by: 'DESC' } },
      },
      {
        _key: true,
        language: { _key: true, value: true},
        last_name: true,
        first_name: true,
        proficiency:  { _key: true, value: true},
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
      }
    );
  }
}
