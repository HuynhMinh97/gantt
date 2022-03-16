import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserOnboardingService extends AitBaseService {
  collection = 'user_profile';
  returnFields = {
    _key: true,
    user_id: true,
    country_region: {
      _key: true,
      value: true,
    },
    province_city: {
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
    current_job_title: {
      _key: true,
      value: true,
    },
    job_setting_title: {
      _key: true,
      value: true,
    },
    industry: {
      _key: true,
      value: true,
    },
    industry_working: {
      _key: true,
      value: true,
    },
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
    del_flag: true,
  };

  async findUserOnboardingByKey(_key?: string) {
    const condition: any = {
      user_id: _key,
    };

    const specialFields = ['gender', 'country_region', 'province_city', 'district', 'ward'];

    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code',
      };
    });

    const keyMasterArray = [
      {
        att: 'current_job_title',
        col: 'm_title',
      },
      {
        att: 'company_working',
        col: 'm_company',
      },
      {
        att: 'industry',
        col: 'm_industry',
      },
      {
        att: 'industry_working',
        col: 'm_industry',
      },
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

  async findUserSkills(_id?: string) {
    const condition: any = {
      _from: _id,
    };
    const returnFields = {
      _to: true,
      sort_no: true,
    };
    const request = {};
    request['collection'] = 'user_skill';
    request['condition'] = condition;
    return await this.query('findUserSkill', request, returnFields);
  }

  async findMSkills(_id?: string) {
    const condition: any = {
      _key: _id,
    };
    const returnFields = {
      _key: true,
    };
    const request = {};
    request['collection'] = 'm_skill';
    request['condition'] = condition;
    return await this.query('findSystem', request, returnFields);
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

  async saveUserSkills(data: any[]) {
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

  async removeSkills(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeSkill',
      'user_skill',
      data,
      returnFields
    );
  }

  async findSkillsByCode(code: string) {
    const condition: any = {
      code: code,
    };
    const returnFields = {
      _key: true,
    };
    const request = {};
    request['collection'] = 'm_skill';
    request['condition'] = condition;
    return await this.query('findSkillOnboarding', request, returnFields);
  }
}
