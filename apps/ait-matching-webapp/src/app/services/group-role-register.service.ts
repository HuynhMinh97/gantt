import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupRoleRegisterService extends AitBaseService {
  public name: string;
  public roleDataSave = null;
  public groupRole = null;
  public groupRoleList = null;
  public groupSaveRole = null;




  async getGroupRoleList(user_id: string) {
    const condition = {
      user_id: user_id
    }
    // if (!condition['school']){
    //   condition['school'] = {}
    // }
    // condition['school']['attribute'] = 'school';
    // condition['school']['ref_collection'] = 'm_school';
    // condition['school']['ref_attribute'] = 'code';

    // if (!condition['create_by']) {
    //   condition['create_by'] = {};
    // }

    // if (!condition['change_by']) {
    //   condition['change_by'] = {};
    // }
    // condition['create_by']['type'] = 'matching';
    // condition['change_by']['type'] = 'matching';

    return await this.query(
      'getAllRoleOfEmployee',
      {
        collection: 'sys_role',
        condition,
      },
      {
        userId: true,
        _key: true,
        name: true,
        page: true,
        module: true,
        employee_name: true,
        permission:true ,
        create_by: true,
        create_at: true,
        change_by: true,
        change_at: true,
      }
    );
  }


  async saveRoleName(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSysRole',
      'sys_role',
      [data],
      returnField
    );
  }

  async saveRolePage(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSysRolePage',
      'sys_role_page',
      [data],
      returnField
    );
  }
}


