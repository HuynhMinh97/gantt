import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserJobAlertService extends AitBaseService {
  saveUserJobAlert = async (data: any[]) => {
    return await this.mutation('saveUserJobAlert', 'user_job_query', data, { _key: true });
  }
  
  findUserJobAlert = async (userId : string) => {
    const condition = {
      user_id: userId,
      del_flag: false
    }
    const specialFields = ['experience_level', 'employee_type', 'location'];
    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code',
      };
    });
    
    condition['industry'] = {
      attribute: 'industry',
      ref_collection: 'm_industry',
      ref_attribute: 'code'
    };

    return await this.query('findUserJobAlert', {collection: 'user_job_query',  condition    }, 
    {
      _key : true,
      user_id: true,
      salary_to: true,
      salary_from: true,
      start_date_to: true,
      start_date_from: true,
      experience_level:{
        _key: true,
        value: true,
      },
      employee_type:{
        _key: true,
        value: true,
      },
      location:{
        _key: true,
        value: true,
      },
      industry:{
        _key: true,
        value: true,
      },
    })
  }


}
