import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyQueriesService extends AitBaseService {
  collection = 'biz_project';
  returnFields = {
    _key: true,
    active_flag: true,
    project_ait_name: true,
    industry: {
      _key: true,
      value: true,
    },
    title: {
      _key: true,
      value: true,
    },
    level: {
      _key: true,
      value: true,
    },
    location: {
      _key: true,
      value: true,
    },
    skills: {
      _key: true,
      value: true,
    },
    skill: true,
    create_by: true,
    change_by: true,
    create_at: true,
    capacity_time_from: true,
    capacity_time_to: true,
    change_at: true,
  };

  async searchProjectCompany(condition = {}) {
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    if (!condition['industry']) {
      condition['industry'] = {};
    }
    if (!condition['title']) {
      condition['title'] = {};
    }
    if (!condition['level']) {
      condition['level'] = {};
    }
    if (!condition['location']) {
      condition['location'] = {};
    }
    if (!condition['skill']) {
      condition['skill'] = {};
    }
    condition['industry']['attribute'] = 'industry';
    condition['industry']['ref_collection'] = 'm_industry';
    condition['industry']['ref_attribute'] = '_key';
    condition['title']['attribute'] = 'title';
    condition['title']['ref_collection'] = 'm_title';
    condition['title']['ref_attribute'] = '_key';
    condition['level']['attribute'] = 'level';
    condition['level']['ref_collection'] = 'sys_master_data';
    condition['level']['ref_attribute'] = '_key';
    condition['location']['attribute'] = 'location';
    condition['location']['ref_collection'] = 'sys_master_data';
    condition['location']['ref_attribute'] = '_key';
    condition['skill']['attribute'] = 'skill';
    condition['skill']['ref_collection'] = 'm_skill';
    condition['skill']['ref_attribute'] = '_key';
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';
    return await this.query(
      'searchProjectCompany',
      {
        collection: this.collection,
        condition: condition,
        options: { sort_by: { value: 'capacity_time_from', order_by: 'DESC' } },
      },
      this.returnFields
    );
  }
}
