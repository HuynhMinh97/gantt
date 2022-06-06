import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectListService extends AitBaseService {

  collection = 'biz_project';

  async find(condition = {}) {
    
    condition['del_flag'] = false;

    if (!condition['project_name']){
      condition['project_name'] = {}
    }
    condition['project_name']['attribute'] = 'project_name';
    condition['project_name']['ref_collection'] = 'm_project';
    condition['project_name']['ref_attribute'] = '_key';
    if (!condition['company_working']){
      condition['company_working'] = {}
    }
    condition['company_working']['attribute'] = 'company_working';
    condition['company_working']['ref_collection'] = 'm_company';
    condition['company_working']['ref_attribute'] = '_key';
    if (!condition['title']) {
      condition['title'] = {}
    }
    condition['title']['attribute'] = 'title';
    condition['title']['ref_collection'] = 'm_title';
    condition['title']['ref_attribute'] = '_key';
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';
   
    return await this.query(
      'GetProjectList',
      {
        collection: 'user_project',
        condition
      },
      {
        _key: true,
        user_id: true,
        last_name: true,
        first_name: true,
        company: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
        project_name: {
          _key: true,
          value: true
        },
        start_date_from: true,
        company_working: {
          _key: true,
          value: true
        },
        title: {
          _key: true,
          value: true
        },
        description: true,
        responsibility: true,
        achievement: true,
        skills: true
      }
    );
  }
}
