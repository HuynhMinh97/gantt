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

  

  async saveSkill(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSkill',
       'm_skill',
      [data],
      returnField
    );
  }
}
