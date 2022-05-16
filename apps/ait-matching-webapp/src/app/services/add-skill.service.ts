import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddSkillService extends AitBaseService {


  async getMaxSortNo (condition = {}) {
    condition['del_flag'] = false;
    condition['active_flag'] = true;
    return await this.query(
      'getMaxSortno',
      {
        collection:'m_skill', 
        condition
      },
        
      {sort_no: true}
      )
  }
  async findCategoryByKey(category_key?:string) {
    const returnFields = { 
        name: true
    };
    const request = {};
    request['collection'] = 'sys_master_data';
    request['condition']= {};
    request['condition']['_key'] = category_key;
    return await this.query('findCategoryByKey', request, returnFields);
  }
  

  async saveSkill(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSkillInMSkill',
       'm_skill',
      [data],
      returnField
    );
  }
}
