import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserOnboardingService extends AitBaseService {
  collection = 'user_onboarding';
  returnFields = {
    _key: true,
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
  };

  async findUserOnboardingByKey(_key?: string) {
    const condition: any = {
      _key: _key,
    };

    const keyMasterArray = [
      {
        att: 'school',
        col: 'm_school',
      }
    ];

    keyMasterArray.forEach((item) => {
      condition[item.att] = {
        attribute: item.att,
        ref_collection: item.col,
        ref_attribute: 'code',
      };
    });

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserOnboardingInfo', request, returnFields);
  }

  async save(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserOnboardingInfo',
      this.collection,
      data,
      returnField
    );
  }

  async remove(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserOnboardingInfo',
      this.collection,
      data,
      returnFields
    );
  }
}
