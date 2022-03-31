import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddRoleService extends AitBaseService {
  public roleInfo = null;
  public employee_key = null;
  public roleUser_key = null;
  async getEmployee() {
    const condition = {
      del_flag: false
    };
    condition['type'] = {}
    condition['type']['operator'] = 'IN'
    condition['type']['value'] = '03';

    return await this.query(
      'getAllEmployee',
      {
        collection: 'sys_user',
        condition
      },
      {
        _key: true,
        full_name: true,
      }
    );
  }

  async getRoleUserInfo(_key: string){
    const condition = {
      del_flag: false,
      _key: _key
    };
    return await this.query(
      'getRoleUserInfo',
      {
        collection: 'sys_role_user',
        condition
      },
      {
        _key: true,
        remark: true,
        name: true,
        group_name: true,
        employee_name:  {
          _key: true,
          value: true
        },
        page: {
          _key: true,
          value: true
        },
        module: {
          _key: true,
          value: true
        },
        permission:{
          _key: true,
          value: true
        }
      }
    );
  }

  async removeRoleUser(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeRoleUser',
      'sys_role_user',
      data,
      returnFields
    );
  }
  
}
