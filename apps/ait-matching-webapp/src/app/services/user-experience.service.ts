import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserExperienceService extends AitBaseService {
  collection = 'user_experience';
  returnFields = {
    _key: true,
    user_id: true,
    title: {
      _key: true,
      value: true,
    },
    company_working: {
      _key: true,
      value: true,
    },
    employee_type: {
      _key: true,
      value: true,
    },
    location: {
      _key: true,
      value: true,
    },
    is_working: true,
    start_date_from: true,
    start_date_to: true,
    description: true,
    del_flag: true
  };

  async findUserExperienceByKey(_key?: string) {
    const condition: any = {
      _key: _key,
    };
    const specialFields = ['location', 'employee_type'];

    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code',
      };
    });

    const keyMasterArray = [
      {
        att: 'title',
        col: 'm_title',
      },
      {
        att: 'company_working',
        col: 'sys_company',
      },
    ];

    keyMasterArray.forEach((item) => {
      condition[item.att] = {
        attribute: item.att,
        ref_collection: item.col,
        ref_attribute: 'code'
      };
    });

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserExperienceInfo', request, returnFields);
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

  async findUserProfile(_key?: string) {
    const condition = {
      user_id: _key,
      company_working: {
        attribute: "company_working",
        ref_collection: "sys_company",
        ref_attribute: "code",
      }
    };
    const returnFields = {
      company_working: {
        _key: true,
        value: true,
      },
    };
    const request = {};
    request['collection'] = 'user_profile';
    request['condition'] = condition;
    return await this.query('findUserOnboardingInfo', request, returnFields);
  }

  async save(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserExperienceInfo',
      this.collection,
      data,
      returnField
    );
  }

  async remove(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserExperienceInfo',
      this.collection,
      data,
      returnFields
    );
  }
}
