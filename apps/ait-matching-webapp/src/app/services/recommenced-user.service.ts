import { COLLECTIONS, KEYS } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CompanyInfo } from '../pages/interface';

@Injectable({ providedIn: 'root' })
export class RecommencedUserService extends AitBaseService {
  // private baseUrlEx = 'http://localhost:3000/api/v1';
  private url = environment.API_PATH.AUREOLEV.RECOMMENCED_USER.MATCHING_COMPANY;
  private urldetail =
    environment.API_PATH.AUREOLEV.RECOMMENCED_USER.GET_DETAIL_MATCHING;
  private profileCompUrl =
    environment.API_PATH.AUREOLEV.RECOMMENCED_USER.GET_COMPANY_PROFILE;
  private getTabSaveUrl =
    environment.API_PATH.AUREOLEV.RECOMMENCED_USER.GET_TAB_SAVE;
  private saveCompanyInfo = environment.API_PATH.COMPANY.SAVE;
  private searchCompanyUrl =
    environment.API_PATH.AUREOLEV.RECOMMENCED_USER.SEARCH_COMPANY;

  async getDataTabSave(company_key: string) {
    return SAVE;
    return await this.post(this.getTabSaveUrl, {
      data: [{ list_keys: [company_key] }],
    }).toPromise();
  }

  async searchCompany(keyword: string) {
    return SEARCH;
    return await this.post(this.searchCompanyUrl, {
      condition: { keyword },
    }).toPromise();
  }

  async matchingCompany(company_key: string, input_user?: string[]) {
    return TEST;
    return await this.post(this.url, {
      condition: { company_key, input_users: input_user || [] },
    }).toPromise();
  }

  async matchingCompany2(company_key: string, input_user?: string[]) {
    return TEST2;
  }

  // async getDetailMatching(company_key: string, list_ids: string[]) {
  //   return DATA;
  //   return await this.post(this.urldetail, {
  //     condition: { company_key, list_ids },
  //   }).toPromise();
  // }

  async getDetailMatching() {
    const condition = {};
    const returnFields = {
      _key: true,
      first_name: true,
      last_name: true,
      user_id: true,
      company_working: {
        _key: true,
        value: true
      },
      skills: true
    };

    condition[KEYS.COLLECTION] = COLLECTIONS.USER_PROFILE;
    condition[KEYS.CONDITION] = {};
    condition[KEYS.CONDITION]['company_working'] = {
      attribute: 'company_working',
      ref_collection: 'm_company',
      ref_attribute: 'code'
    };
    return await this.query('findProfileByCondition', condition, returnFields);
  }

  async saveRecommendUser(_from: string, _to: string) {
    const returnField = {
      _key: true
    };
    return await this.mutation(
      'saveRecommendUser',
      'save_recommend_user',
      [{
        _from,
        _to
      }],
      returnField
    );
  }

  async removeSaveRecommendUser(_from: string, _to: string) {
    const returnFields = { _key: true };
    const data = { _from, _to };
    return await this.mutation(
      'removeSaveRecommendUser',
      'save_recommend_user',
      [data],
      returnFields
    );
  }

  async getSkillForUser(id: string) {
    const condition = { condition: { id } };
    const returnFields = {
      skills: true
    };

    return await this.query('findSkillForUser', condition, returnFields);
  }

  async getDetailMatching2(company_key: string, list_ids: string[]) {
    return DATA2;
  }

  async getCompanyProfile(company_key: string | string[]) {
    return PROFILE;
    return await this.post(this.profileCompUrl, {
      condition: { _key: company_key },
    }).toPromise();
  }

  async getCompanyProfileByName(name: string) {
    return PROFILE;
    return await this.post(this.profileCompUrl, {
      condition: { name: name },
    }).toPromise();
  }

  async saveCompanyProfile(
    condition: { user_id: string },
    data: [CompanyInfo]
  ) {
    return await this.post(this.saveCompanyInfo, {
      condition,
      data,
    }).toPromise();
  }
}

export const PROFILE = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 1,
  data: [
    {
      _key: '6036f6b9-ebbd-4a7c-981f-811832a67981',
      name: '大京株式会社第3工場',
      address: '石川県小松市串町工業団地29番地2',
      occupation: {
        _key: '溶接',
        value: '溶接'
      },
      work: {
        _key: '半自動溶接作業',
        value: '半自動溶接作業'
      },
      business: null,
      website: {
        name: null,
        url: null
      },
      phone: null,
      fax: null,
      agreement_file: [],
      size: null,
      representative: null,
      representative_katakana: null,
      representative_position: null,
      representative_email: null,
      acceptance_remark: null
    }
  ]
}

export const SEARCH = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 1,
  data: [
    {
      _key: '6036f6b9-ebbd-4a7c-981f-811832a67981',
      value: '大京株式会社第3工場'
    }
  ]
}

export const DATA2 = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 6,
  data: [
    {
      _key: '30fdaf76-fb51-472d-870e-e8e0c3b201a2',
      avatar_url: [],
      business: [
        {
          _key: '17999000',
          value: '自動車整備分野'
        }
      ],
      change_at: 1643589890000,
      change_by: '髙島　法子',
      create_at: 1605077820000,
      create_by: 'アドニス管理用',
      desired_occupation: null,
      desired_salary: 200000,
      dob: 927590400000,
      gender: {
        _key: '男性',
        value: 'Male'
      },
      is_matching: false,
      is_saved: true,
      name: 'NGUYEN QUANG TOAN',
      name_kana: 'グエン　クアン　トアン',
      prefecture: [
        {
          _key: '17999157',
          value: '愛知県'
        }
      ],
      remark: null,
      residence_status: {
        _key: '技能実習2号ロ',
        value: '技能実習2号ロ'
      },
      save_user: {
        _from: 'sys_company/d3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        _id: 'save_company_user/1e3efd65-7d9c-8e9b-180d-ae52063cef8f',
        _key: '1e3efd65-7d9c-8e9b-180d-ae52063cef8f',
        _rev: '_d5pmtgy---',
        _to: 'sys_user/41871df4-bbae-416b-9386-5a965d64a1ed',
        change_at: 1648108289581,
        change_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        create_at: 1648108289581,
        create_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        del_flag: false,
        is_matching: true,
        relationship: 'save_company_user',
        user_id: '82fbeac6-5147-41da-8c1b-185cc4d21148'
      },
      stay_period: 1646179200000,
      user_id: '41871df4-bbae-416b-9386-5a965d64a1ed',
      work: {
        _key: '金属塗装作業',
        value: '金属塗装作業'
      },
      timeDiffByDay: -22,
      stamp: 0
    },
    {
      _key: '535fffb6-f389-4130-9db8-380d8e17eee3',
      avatar_url: [],
      business: [
        {
          _key: '17998993',
          value: '介護分野'
        },
        {
          _key: '17999000',
          value: '自動車整備分野'
        },
        {
          _key: '17999005',
          value: '飲食料品製造業分野'
        }
      ],
      change_at: 1644379436000,
      change_by: '西野　友莉乃',
      create_at: 1605077820000,
      create_by: 'アドニス管理用',
      desired_occupation: null,
      desired_salary: 210000,
      dob: 900633600000,
      gender: {
        _key: '男性',
        value: 'Male'
      },
      is_matching: false,
      is_saved: true,
      name: 'NGUYEN HUU THANG',
      name_kana: 'グエン　ヒュー　タン',
      prefecture: [
        {
          _key: '17999147',
          value: '東京都'
        },
        {
          _key: '17999157',
          value: '愛知県'
        },
        {
          _key: '17999161',
          value: '大阪府'
        }
      ],
      remark: null,
      residence_status: {
        _key: '技能実習2号ロ',
        value: '技能実習2号ロ'
      },
      save_user: {
        _from: 'sys_company/d3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        _id: 'save_company_user/4c87258f-c7b3-74d0-7383-dc3c586f90ba',
        _key: '4c87258f-c7b3-74d0-7383-dc3c586f90ba',
        _rev: '_d5UfvI2---',
        _to: 'sys_user/4432909d-e733-4645-ab7c-2a479ed4f02e',
        change_at: 1648019752109,
        change_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        create_at: 1648019752109,
        create_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        del_flag: false,
        is_matching: true,
        relationship: 'save_company_user',
        user_id: '82fbeac6-5147-41da-8c1b-185cc4d21148'
      },
      stay_period: 1657065600000,
      user_id: '4432909d-e733-4645-ab7c-2a479ed4f02e',
      work: {
        _key: '印刷箱製箱作業',
        value: '印刷箱製箱作業'
      },
      timeDiffByDay: 103,
      stamp: 0
    },
    {
      _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
      avatar_url: [],
      business: [
        {
          _key: '17998993',
          value: '介護分野'
        },
        {
          _key: '17999005',
          value: '飲食料品製造業分野'
        },
        {
          _key: '17999006',
          value: '外食業分野'
        }
      ],
      change_at: 1644379448000,
      change_by: '西野　友莉乃',
      create_at: 1605077820000,
      create_by: 'アドニス管理用',
      desired_occupation: null,
      desired_salary: 210000,
      dob: 941328000000,
      gender: {
        _key: '男性',
        value: 'Male'
      },
      is_matching: false,
      is_saved: true,
      name: 'DAM DUY THANH',
      name_kana: 'ダム　ズイ　タイン',
      prefecture: [
        {
          _key: '17999157',
          value: '愛知県'
        },
        {
          _key: '17999161',
          value: '大阪府'
        }
      ],
      remark: null,
      residence_status: {
        _key: '技能実習2号ロ',
        value: '技能実習2号ロ'
      },
      save_user: {
        _from: 'sys_company/d3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        _id: 'save_company_user/7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _key: '7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _rev: '_d5Ufrya---',
        _to: 'sys_user/4ec2f09f-f747-4f46-a78a-47d9d5890463',
        change_at: 1648019748679,
        change_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        create_at: 1648019748679,
        create_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        del_flag: false,
        is_matching: true,
        relationship: 'save_company_user',
        user_id: '82fbeac6-5147-41da-8c1b-185cc4d21148'
      },
      stay_period: 1657065600000,
      user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
      work: {
        _key: '印刷箱製箱作業',
        value: '印刷箱製箱作業'
      },
      timeDiffByDay: 103,
      stamp: 0
    },
    {
      _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
      avatar_url: [],
      business: [
        {
          _key: '17998993',
          value: '介護分野'
        },
        {
          _key: '17999005',
          value: '飲食料品製造業分野'
        },
        {
          _key: '17999006',
          value: '外食業分野'
        }
      ],
      change_at: 1644379448000,
      change_by: '西野　友莉乃',
      create_at: 1605077820000,
      create_by: 'アドニス管理用',
      desired_occupation: null,
      desired_salary: 210000,
      dob: 941328000000,
      gender: {
        _key: '男性',
        value: 'Male'
      },
      is_matching: false,
      is_saved: true,
      name: 'DAM DUY THANH',
      name_kana: 'ダム　ズイ　タイン',
      prefecture: [
        {
          _key: '17999157',
          value: '愛知県'
        },
        {
          _key: '17999161',
          value: '大阪府'
        }
      ],
      remark: null,
      residence_status: {
        _key: '技能実習2号ロ',
        value: '技能実習2号ロ'
      },
      save_user: {
        _from: 'sys_company/d3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        _id: 'save_company_user/7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _key: '7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _rev: '_d5Ufrya---',
        _to: 'sys_user/4ec2f09f-f747-4f46-a78a-47d9d5890463',
        change_at: 1648019748679,
        change_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        create_at: 1648019748679,
        create_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        del_flag: false,
        is_matching: true,
        relationship: 'save_company_user',
        user_id: '82fbeac6-5147-41da-8c1b-185cc4d21148'
      },
      stay_period: 1657065600000,
      user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
      work: {
        _key: '印刷箱製箱作業',
        value: '印刷箱製箱作業'
      },
      timeDiffByDay: 103,
      stamp: 0
    },
    {
      _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
      avatar_url: [],
      business: [
        {
          _key: '17998993',
          value: '介護分野'
        },
        {
          _key: '17999005',
          value: '飲食料品製造業分野'
        },
        {
          _key: '17999006',
          value: '外食業分野'
        }
      ],
      change_at: 1644379448000,
      change_by: '西野　友莉乃',
      create_at: 1605077820000,
      create_by: 'アドニス管理用',
      desired_occupation: null,
      desired_salary: 210000,
      dob: 941328000000,
      gender: {
        _key: '男性',
        value: 'Male'
      },
      is_matching: false,
      is_saved: true,
      name: 'DAM DUY THANH',
      name_kana: 'ダム　ズイ　タイン',
      prefecture: [
        {
          _key: '17999157',
          value: '愛知県'
        },
        {
          _key: '17999161',
          value: '大阪府'
        }
      ],
      remark: null,
      residence_status: {
        _key: '技能実習2号ロ',
        value: '技能実習2号ロ'
      },
      save_user: {
        _from: 'sys_company/d3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        _id: 'save_company_user/7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _key: '7dd3e4fb-718b-6ebb-bb26-e7295e287586',
        _rev: '_d5Ufrya---',
        _to: 'sys_user/4ec2f09f-f747-4f46-a78a-47d9d5890463',
        change_at: 1648019748679,
        change_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        create_at: 1648019748679,
        create_by: '82fbeac6-5147-41da-8c1b-185cc4d21148',
        del_flag: false,
        is_matching: true,
        relationship: 'save_company_user',
        user_id: '82fbeac6-5147-41da-8c1b-185cc4d21148'
      },
      stay_period: 1657065600000,
      user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
      work: {
        _key: '印刷箱製箱作業',
        value: '印刷箱製箱作業'
      },
      timeDiffByDay: 103,
      stamp: 0
    },
    {
      _key: null,
      avatar_url: null,
      business: null,
      change_at: null,
      change_by: null,
      create_at: null,
      create_by: null,
      desired_occupation: null,
      desired_salary: null,
      dob: null,
      gender: null,
      is_matching: null,
      is_saved: false,
      name: null,
      name_kana: null,
      prefecture: null,
      remark: null,
      residence_status: null,
      save_user: null,
      stay_period: null,
      user_id: null,
      work: null,
      timeDiffByDay: null,
      stamp: 0
    }
  ]
}

export const TEST2 = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 6,
  data: [
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '41871df4-bbae-416b-9386-5a965d64a1ed'
    },
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '4432909d-e733-4645-ab7c-2a479ed4f02e'
    },
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '4ec2f09f-f747-4f46-a78a-47d9d5890463'
    },
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '4ec2f09f-f747-4f46-a78a-47d9d5890463'
    },
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '4ec2f09f-f747-4f46-a78a-47d9d5890463'
    },
    {
      group_no: 3,
      matching_attributes: [],
      total_score: 0,
      value: '3576d2df-470b-4799-a84b-c5af47cec176'
    }
  ]
};

export const SAVE = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 6,
  data: [
    {
      vertex: {
        user_profile: {
          _key: '30fdaf76-fb51-472d-870e-e8e0c3b201a2',
          _id: 'user_profile/30fdaf76-fb51-472d-870e-e8e0c3b201a2',
          _rev: '_do0xUmy---',
          accepting_company: '株式会社内潟自動車整備工場',
          address: '〒929-1175　石川県かほく市秋浜ニ20-1　AIプラザ201',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 927590400000,
          dob_jp: '平成11年5月25日',
          employment_start_date: 1554249600000,
          gender: '男性',
          immigration_date: 1551398400000,
          name: 'NGUYEN QUANG TOAN',
          name_kana: 'グエン　クアン　トアン',
          no2_permit_date: 1583107200000,
          no3_exam_dept_date: 1630368000000,
          no3_exam_dept_pass: '合格',
          no3_exam_practice_date: 1630368000000,
          no3_exam_practice_pass: '不合格',
          no3_permit_date: null,
          occupation: '塗装',
          passport_number: 'C5489640',
          relation_pic: '中本　千妃呂',
          residence_status: '技能実習2号ロ',
          resume: [],
          stay_period: 1646179200000,
          training_remark: null,
          translate_pic: 'PHAM VU NAM DUONG',
          work: '金属塗装作業',
          user_id: '41871df4-bbae-416b-9386-5a965d64a1ed',
          create_by: 'アドニス管理用',
          no: 914,
          del_flag: false,
          change_at: 1643589890000,
          is_matching: false,
          change_by: '髙島　法子',
          create_at: 1605077820000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    },
    {
      vertex: {
        user_profile: {
          _key: '535fffb6-f389-4130-9db8-380d8e17eee3',
          _id: 'user_profile/535fffb6-f389-4130-9db8-380d8e17eee3',
          _rev: '_drxNA4m---',
          accepting_company: '丸福株式会社（岐阜営業所）',
          address: '〒505-0052　岐阜県美濃加茂市加茂野町今泉286番地1 第二ガーデンヒルズ202号',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 900633600000,
          dob_jp: '平成10年7月17日',
          employment_start_date: 1565049600000,
          gender: '男性',
          immigration_date: 1562198400000,
          name: 'NGUYEN HUU THANG',
          name_kana: 'グエン　ヒュー　タン',
          no2_permit_date: 1593993600000,
          no3_exam_dept_date: null,
          no3_exam_dept_pass: null,
          no3_exam_practice_date: null,
          no3_exam_practice_pass: null,
          no3_permit_date: null,
          occupation: '紙器・段ボール箱製造',
          passport_number: 'C4708173',
          relation_pic: '新田　泉',
          residence_status: '技能実習2号ロ',
          resume: [],
          stay_period: 1657065600000,
          training_remark: null,
          translate_pic: 'Le Thi Minh Ngoc',
          work: '印刷箱製箱作業',
          user_id: '4432909d-e733-4645-ab7c-2a479ed4f02e',
          create_by: 'アドニス管理用',
          no: 1055,
          del_flag: false,
          change_at: 1644379436000,
          is_matching: false,
          change_by: '西野　友莉乃',
          create_at: 1605077820000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    },
    {
      vertex: {
        user_profile: {
          _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _id: 'user_profile/2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _rev: '_drxNA6i---',
          accepting_company: '丸福株式会社（岐阜営業所）',
          address: '〒505-0052　岐阜県美濃加茂市加茂野町今泉286番地1 第二ガーデンヒルズ202号',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 941328000000,
          dob_jp: '平成11年10月31日',
          employment_start_date: 1565049600000,
          gender: '男性',
          immigration_date: 1562198400000,
          name: 'DAM DUY THANH',
          name_kana: 'ダム　ズイ　タイン',
          no2_permit_date: 1593993600000,
          no3_exam_dept_date: null,
          no3_exam_dept_pass: null,
          no3_exam_practice_date: null,
          no3_exam_practice_pass: null,
          no3_permit_date: null,
          occupation: '紙器・段ボール箱製造',
          passport_number: 'C6326145',
          relation_pic: '新田　泉',
          residence_status: '技能実習2号ロ',
          resume: [],
          stay_period: 1657065600000,
          training_remark: null,
          translate_pic: 'Le Thi Minh Ngoc',
          work: '印刷箱製箱作業',
          user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
          create_by: 'アドニス管理用',
          no: 1057,
          del_flag: false,
          change_at: 1644379448000,
          is_matching: false,
          change_by: '西野　友莉乃',
          create_at: 1605077820000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    },
    {
      vertex: {
        user_profile: {
          _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _id: 'user_profile/2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _rev: '_drxNA6i---',
          accepting_company: '丸福株式会社（岐阜営業所）',
          address: '〒505-0052　岐阜県美濃加茂市加茂野町今泉286番地1 第二ガーデンヒルズ202号',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 941328000000,
          dob_jp: '平成11年10月31日',
          employment_start_date: 1565049600000,
          gender: '男性',
          immigration_date: 1562198400000,
          name: 'DAM DUY THANH',
          name_kana: 'ダム　ズイ　タイン',
          no2_permit_date: 1593993600000,
          no3_exam_dept_date: null,
          no3_exam_dept_pass: null,
          no3_exam_practice_date: null,
          no3_exam_practice_pass: null,
          no3_permit_date: null,
          occupation: '紙器・段ボール箱製造',
          passport_number: 'C6326145',
          relation_pic: '新田　泉',
          residence_status: '技能実習2号ロ',
          resume: [],
          stay_period: 1657065600000,
          training_remark: null,
          translate_pic: 'Le Thi Minh Ngoc',
          work: '印刷箱製箱作業',
          user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
          create_by: 'アドニス管理用',
          no: 1057,
          del_flag: false,
          change_at: 1644379448000,
          is_matching: false,
          change_by: '西野　友莉乃',
          create_at: 1605077820000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    },
    {
      vertex: {
        user_profile: {
          _key: '2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _id: 'user_profile/2f1356c0-b197-4dcb-a8df-699c75f484a0',
          _rev: '_drxNA6i---',
          accepting_company: '丸福株式会社（岐阜営業所）',
          address: '〒505-0052　岐阜県美濃加茂市加茂野町今泉286番地1 第二ガーデンヒルズ202号',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 941328000000,
          dob_jp: '平成11年10月31日',
          employment_start_date: 1565049600000,
          gender: '男性',
          immigration_date: 1562198400000,
          name: 'DAM DUY THANH',
          name_kana: 'ダム　ズイ　タイン',
          no2_permit_date: 1593993600000,
          no3_exam_dept_date: null,
          no3_exam_dept_pass: null,
          no3_exam_practice_date: null,
          no3_exam_practice_pass: null,
          no3_permit_date: null,
          occupation: '紙器・段ボール箱製造',
          passport_number: 'C6326145',
          relation_pic: '新田　泉',
          residence_status: '技能実習2号ロ',
          resume: [],
          stay_period: 1657065600000,
          training_remark: null,
          translate_pic: 'Le Thi Minh Ngoc',
          work: '印刷箱製箱作業',
          user_id: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
          create_by: 'アドニス管理用',
          no: 1057,
          del_flag: false,
          change_at: 1644379448000,
          is_matching: false,
          change_by: '西野　友莉乃',
          create_at: 1605077820000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    },
    {
      vertex: {
        user_profile: {
          _key: '98072618-2042-4f0c-9784-22291a873355',
          _id: 'user_profile/98072618-2042-4f0c-9784-22291a873355',
          _rev: '_dtjpqQq---',
          accepting_company: '株式会社歯愛メディカル',
          address: '〒920-0381　金沢市中屋1丁目112番地',
          agreement: [],
          agreement_file: [],
          avatar_url: [],
          country: 'ベトナム',
          current_salary: null,
          dob: 790387200000,
          dob_jp: '平成7年1月18日',
          employment_start_date: 1533254400000,
          gender: '女性',
          immigration_date: 1530489600000,
          name: 'DINH THI MY HUONG',
          name_kana: 'ディン　ティ　ミー  フオン',
          no2_permit_date: 1562025600000,
          no3_exam_dept_date: 1614643200000,
          no3_exam_dept_pass: '合格',
          no3_exam_practice_date: 1607558400000,
          no3_exam_practice_pass: '合格',
          no3_permit_date: null,
          occupation: '工業包装',
          passport_number: 'C3215921',
          relation_pic: '林　祐理',
          residence_status: '特定活動',
          resume: [],
          stay_period: 1641340800000,
          training_remark: null,
          translate_pic: 'Le Thi Minh Ngoc',
          work: '工業包装作業',
          user_id: '3576d2df-470b-4799-a84b-c5af47cec176',
          create_by: 'アドニス管理用',
          no: 612,
          del_flag: true,
          change_at: 1628651852000,
          is_matching: false,
          change_by: '高柳　薫里',
          create_at: 1605077760000,
          company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
          emp_type: 'オレオウ組合',
          type: '03'
        }
      }
    }
  ]
};

export const DATA = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 8,
  data: [
    {
      _key: '1m23',
      user_id: '99999m',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '123a',
      user_id: '99999a',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '12b3',
      user_id: '9999b9',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '1c23',
      user_id: '999c99',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '1d23',
      user_id: '999d99',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '12e3',
      user_id: '9e9999',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '1f23',
      user_id: '99f999',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '12g3',
      user_id: '9999g9',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '1h23',
      user_id: '9h9999',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '1i23',
      user_id: '999i99',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '12k3',
      user_id: '99k999',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
    {
      _key: '12l23',
      user_id: '99l999',
      first_name: 'thuận 1',
      last_name: 'nguyễn văn ',
      name: 'test',
      katakana: null,
      romaji: null,
      gender: 'MALE',
      bod: 1635699600000,
      phone_number: '12156465',
      about: 'good',
      country_region: 'VIETNAM',
      postcode: '2313',
      province_city: 'HCM',
      district: 'Quan1',
      ward: 'DaKao',
      address: 'dfadf',
      floor_building: 'dfdf',
      company_working: 'AIT',
      title: 'Developer',
      industry: 'Computer',
      skills: [
        'Ki nang thuyet trinh',
        'Ki nang giao tiep',
        'Eclipse',
        'Visual Studio Code',
        'Java',
        '.Net',
        'Angular',
        'Phython'
      ],
      company: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
      is_matching: true,
      del_flag: false,
      create_by: '99999',
      change_by: '99999',
      create_at: 1637201687907,
      change_at: 1638185656603
    },
  ],
};

export const TEST = {
  status: 200,
  message: '',
  errors: [],
  numError: 0,
  numData: 27,
  data: [
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '41871df4-bbae-416b-9386-5a965d64a1ed',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '41871df4-bbae-416b-9386-5a965d64a1ed',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '4432909d-e733-4645-ab7c-2a479ed4f02e',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4742817a-87a4-42c9-b125-eb6451617fd4',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '4742817a-87a4-42c9-b125-eb6451617fd4',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '4d0a5705-bafa-4052-8a15-bbd5a76861b9',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '4ec2f09f-f747-4f46-a78a-47d9d5890463',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '59196792-3515-4f8a-be59-f38bcadb18db',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '59196792-3515-4f8a-be59-f38bcadb18db',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '63968f8e-7667-4bab-82d5-ee31d26c9df9',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '6d3b00f0-33ae-464a-a3b7-35c8e8e21b7d',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '73c94a79-3bb7-4ba0-bb58-ac02a48a85e2',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '7ef762c0-b486-4dbb-a590-0441cf9cf994',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '8d326e5a-24fc-4790-9729-678e7f675a9b',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '8e9070aa-4991-4878-ad8e-d5d1483d2946',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '90b62c26-cd5b-45bd-92b3-d2fabdfc9ecc',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: '957e4c17-d0e6-47e3-a2b2-403aaf739560',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'a360446f-d7b2-42e7-b9da-d62660bfdbf2',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'a7243d47-749f-4a34-a50d-1697a17df55e',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'aacdd12e-faf7-4d37-8edb-9427fd8fe811',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'ba978621-73bb-46b8-aca8-e73da5dc70ec',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'bdf5d64d-b6d0-4d30-8fe8-51c109727055',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'c4365063-57ba-4366-a731-aca90a4d3a1b',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'c6050b5d-c220-45f6-ab80-eb29d821f459',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'e44d8c46-c6ae-4f26-af9d-7442a8322465',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'e4c17a6c-abfb-4aae-96b4-b744ff15e414',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'e80798fa-3819-417b-906f-c0b76f4e9830',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'e963092f-7ef4-41ba-8b32-e18214c289cf',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'f8eed48b-4bc4-47a5-9b9f-50d8712f9353',
    },
    {
      group_no: 1,
      matching_attributes: [
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'business',
          score: 0.21,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_apply',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'occupation_only_experienced',
          score: 0.12,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'work',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'residence_status',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'prefecture',
          score: 0.1,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'salary',
          score: 0.15,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'age',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'gender',
          score: 0.05,
        },
        {
          matching_detail: [
            {
              output: {
                value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
              },
              source: {},
              target: {},
            },
          ],
          matching_name: 'japanese_skill',
          score: 0.05,
        },
      ],
      total_score: 1,
      value: 'fac8d28a-8f16-4390-89e6-cdf0e14dcdde',
    },
  ],
};
