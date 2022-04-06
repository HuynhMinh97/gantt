import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupDataListService extends AitBaseService {

  async getGroupDataList(condition = {}) {
    
   

    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'searchRole',
      {
        collection: 'sys_role',
        condition,
      },
      {
        userId: true,
        _key: true,
        name: true,
        employee_name: true,
        permission:true ,
        create_by: true,
        create_at: true,
        change_by: true,
        change_at: true,
      }
    );
  }

  
}
