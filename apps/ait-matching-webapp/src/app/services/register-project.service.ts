import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterProjectService extends AitBaseService{

  async findProjectAitByKey(_key?:string) {
    const returnFields = { 
      _key: true,
      active_flag: true,
      valid_time_from: true,
      valid_time_to: true,
      project_ait_name: true,
      create_by: true,
      change_by: true,
      create_at: true,
      change_at: true,
      location: {
        _key: true,
        value: true
      },
      title: {
        _key: true,
        value: true
      },
      level: {
        _key: true,
        value: true
      },
      industry: {
        _key: true,
        value: true
      },
      remark: true,
      description:true
    };
    const request = {};
    request['collection'] = 'biz_project';
    request['condition']= {};
    request['condition']['industry'] = {
      attribute: 'industry',
      ref_collection: 'm_industry',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['skills'] = {
      attribute: 'skills',
      ref_collection: 'm_skill',
      ref_attribute: '_key',
      get_by: '_key',
    };
    request['condition']['level'] = {
      attribute: 'level',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
      // class: 'EMPLOYEE_LEVEL'
    };
    request['condition']['location'] = {
      attribute: 'location',
      ref_collection: 'sys_master_data',
      ref_attribute: '_key',
      get_by: '_key',
      // class: 'EMPLOYEE_LEVEL'
    };

    request['condition']['_key'] = _key;
    request['condition']['create_by'] = {};
    request['condition']['change_by'] = {};
    request['condition']['create_by']['type'] = 'matching';
    request['condition']['change_by']['type'] = 'matching';
    return await this.query('findProjectAitByKey', request, returnFields);
  }

  async findSkillProject(_key: string){
    const condition = {
      _key: _key,
      del_flag: false,
    }
    return await this.query('findSkillProject', { collection: 'biz_project', condition },
      {
        skills: {
          _key: true,
          value: true
        }
      })
   }

   async getBizProjectUser(_key: string){
    const condition = {
      _key: _key,
      del_flag: false,
    }
    return await this.query('getBizProjectUser', { collection: 'biz_project_user', condition },
      {
        first_name: true,
        last_name: true,
        start_plan: true,
        end_plan: true,
        hours_plan: true,
        manday_plan: true,
        manmonth_plan: true,
        remark: true,
        _key: true,
        user_id: true
      })
   }

}
