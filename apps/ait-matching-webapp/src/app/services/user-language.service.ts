import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserLanguageService extends AitBaseService {
  collection = 'user_language';
  returnFields = {
    _key: true,
    user_id: true,
    language: {
      _key: true,
      value: true,
    },
    proficiency: {
      _key: true,
      value: true,
    },
    del_flag: true,
  };

  async findUserLanguageByKey(_key?: string) {
    const condition: any = {
      _key: _key,
    };

    const specialFields = ['language', 'proficiency'];

    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: '_key',
        get_by: '_key',
      };
    });

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserLanguageInfo', request, returnFields);
  }

  

  async save(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserLanguageInfo',
      this.collection,
      data,
      returnField
    );
  }

  async remove(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserLanguageInfo',
      this.collection,
      data,
      returnFields
    );
  }

  // profile
  async findUserLanguageByUserId(user_id?: string) {
    const condition: any = {
      user_id: user_id,
    };

    const specialFields = ['language', 'proficiency'];

    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: '_key',
        get_by: '_key',
      };
    });

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserLanguageInfo', request, returnFields);
  }
}
