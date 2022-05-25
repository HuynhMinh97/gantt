import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterProjectService extends AitBaseService{

  async findProjectAitByKey(_key?:string) {
    const returnFields = { 
      _key: true,
      valid_time_from: true,
      valid_time_to: true,
      ait_project_name: true,
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

}