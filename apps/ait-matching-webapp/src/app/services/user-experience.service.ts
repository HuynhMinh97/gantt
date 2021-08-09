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
    //start_date_to: true,
    description: true,
  };

  async findUserExperienceByKey(condition?: any) {
    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    console.log(request);
    return await this.query('findUserExperienceInfo', request, returnFields);
  }

  async save(data: any) {
    const returnField = { user_id: true, _key: true };
    return await this.mutation(
      'saveUserExperienceInfo',
      'user_experience',
      [data],
      returnField
    );
  }

  async remove(data: any) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation(
      'removeUserExperienceInfo',
      this.collection,
      [data],
      returnFields
    );
  }
}
