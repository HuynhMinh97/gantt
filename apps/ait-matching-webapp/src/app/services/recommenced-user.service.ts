import { COLLECTIONS, KEYS } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecommencedUserService extends AitBaseService {
  private matchingUrl = environment.API_PATH.RECOMMENCED.MATCHING_USER;
  returnFields = {
    _key: true,
    first_name: true,
    last_name: true,
    user_id: true,
    company_working: {
      _key: true,
      value: true,
    },
    industry_working: {
      _key: true,
      value: true,
    },
    current_job_title: {
      _key: true,
      value: true,
    },
    current_job_level: {
      _key: true,
      value: true,
    },
    province_city: {
      _key: true,
      value: true,
    },
    skills: {
      _key: true,
      name: true,
      level: true,
    },
    is_saved: true,
    create_by: true,
    change_by: true,
    create_at: true,
    change_at: true,
  };
  // returnFi
  async matchingUser(keyword: string) {
    return await this.post(this.matchingUrl, {
      condition: { keyword },
    }).toPromise();
  }

  async getUserByList(list: string[], onlySaved = false, start = 0, end = 8) {
    const condition = {};

    condition[KEYS.COLLECTION] = COLLECTIONS.USER_PROFILE;
    condition[KEYS.CONDITION] = { start, end, list };
    if (onlySaved) {
      condition[KEYS.CONDITION]['is_saved'] = true;
    }
    return await this.query('findProfileByList', condition, this.returnFields);
  }

  async getDetailMatching(onlySaved = false, start = 0, end = 8) {
    const condition = {};

    condition[KEYS.COLLECTION] = COLLECTIONS.USER_PROFILE;
    condition[KEYS.CONDITION] = { start, end };
    if (onlySaved) {
      condition[KEYS.CONDITION]['is_saved'] = true;
    }
    return await this.query(
      'findProfileByCondition',
      condition,
      this.returnFields
    );
  }

  async saveRecommendUser(_from: string, _to: string) {
    const returnField = {
      _key: true,
    };
    return await this.mutation(
      'saveRecommendUser',
      'save_recommend_user',
      [
        {
          _from,
          _to,
        },
      ],
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
      skills: true,
    };

    return await this.query('findSkillForUser', condition, returnFields);
  }
}
