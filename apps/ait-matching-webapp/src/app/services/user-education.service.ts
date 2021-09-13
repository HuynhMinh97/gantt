import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserEducationService extends AitBaseService {
  collection = 'user_education';
  returnFields = {
    _key: true,
    user_id: true,
    school: {
      _key: true,
      value: true,
    },
    degree: true,
    field_of_study: true,
    grade: true,
    file: true,
    start_date_from: true,
    start_date_to: true,
    description: true,
    del_flag: true,
  };

  async findUserEducationByKey(_key?: string) {
    const condition: any = {
      _key: _key,
    };

    condition['school'] = {
      attribute: 'school',
      ref_collection: 'm_school',
      ref_attribute: 'code',
    };

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserEducationInfo', request, returnFields);
  }

  async findKeyCompany(_key?: string) {
    const condition = {
      company: _key,
    };
    const returnFields = { code: true };
    const request = {};
    request['collection'] = 'sys_company';
    request['condition'] = condition;
    return await this.query('findSystem', request, returnFields);
  }

  async findFiles(_key?: string) {
    const returnField = { _key: true };
    const condition = {
      _key: _key,
      del_flag: false,
    };
    const request = {};
    request['collection'] = 'sys_binary_data';
    request['condition'] = condition;
    return await this.query('findSystem', request, returnField);
  }

  async save(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserEducationInfo',
      this.collection,
      data,
      returnField
    );
  }

  async remove(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserEducationInfo',
      this.collection,
      data,
      returnFields
    );
  }
}
