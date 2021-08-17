import { isObjectFull } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserExperienceService extends AitBaseService {
  collection = 'user_experience';
  returnFields = {
    _key: true,
    title: true,
    company_working: true,
    employee_type: true,
    location: true,
    is_working: true,
    start_date_from: true,
    start_date_to: true,
    description: true,
  };

  async findUserExperienceByKey(_key?: string) {
    const condition = {
      _key: _key
    }
    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserExperienceInfo', request, returnFields);
  }

  async findKeyCompany(_key?: string){
    const condition = {
      company: _key
    }
    const returnFields = {_key: true};
    const request = {};
    request['collection'] = 'sys_company';
    request['condition'] = condition;    
    return await this.query('findSystem', request, returnFields);
  }

  async save(data: any[]) {
    const returnField = { user_id: true, _key: true };
    return await this.mutation(
      'saveUserExperienceInfo',
      this.collection,
      data,
      returnField
    );
  }

  async remove(data: any[]) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation(
      'removeUserExperienceInfo',
      this.collection,
      data,
      returnFields
    );
  }
}
