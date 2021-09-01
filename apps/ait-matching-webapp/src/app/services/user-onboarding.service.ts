import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserOnboardingService extends AitBaseService {
  collection = 'user_profile';
  returnFields = {
    _key: true,
    country: {
      _key: true,
      value: true,
    },
    city: {
      _key: true,
      value: true,
    },
    district: {
      _key: true,
      value: true,
    },
    ward: {
      _key: true,
      value: true,
    },
    company_working: {
      _key: true,
      value: true,
    },
    title: {
      _key: true,
      value: true,
    },
    industry: {
      _key: true,
      value: true,
    },
    skills: [{
      _key: true,
      value: true,
    }],
    gender: {
      _key: true,
      value: true,
    },
    first_name: true,
    last_name: true,
    katakana: true,
    romaji: true,
    bod: true,
    phone_number: true,
    about: true,
    postcode: true,
    address: true,
    floor_building: true,
  };

  async findUserOnboardingByKey(_key?: string) {
    const condition: any = {
      _key: _key,
    };

    const specialFields = ['gender', 'country', 'city', 'district', 'ward'];

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
      {
        att: 'industry',
        col: 'm_industry',
      },
      {
        att: 'skills',
        col: 'm_skill',
      },
    ];

    keyMasterArray.forEach((item) => {
      condition[item.att] = {
        attribute: item.att,
        ref_collection: item.col,
        ref_attribute: '_key',
      };
    });

    const returnFields = this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    request['condition'] = condition;
    return await this.query('findUserOnboardingInfo', request, returnFields);
  }

  async findSiteLanguageById(_id?: string) {
    const condition: any = {
      user_id: _id,
    };
    const returnFields = {
      site_language: true,
    };
    const request = {};
    request['collection'] = 'user_setting';
    request['condition'] = condition;
    return await this.query('findUserSetting', request, returnFields);
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

  async saveUserSkill(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserSkill',
      'user_skill',
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
