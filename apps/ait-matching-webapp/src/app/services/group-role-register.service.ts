import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroupRoleRegisterService extends AitBaseService {
  public role_key: string;
  public roleDataSave = null;
  public groupRole = null;
  public groupRoleList = null;
  public groupSaveRole = null;

  async getGroupRoleList(role_key: string, employee_key: string) {
    const condition = {
      role_key: role_key,
      employee_key: employee_key
    };
    
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'getAllRoleOfGroupRole',
      {
        collection: 'sys_role_user',
        condition,
      },
      {
        userId: true,
        roleUser_key: true,
        _key: true,
        name: true,
        child_name: true,
        page: true,
        module: true,
        employee_name: true,
        permission: true,
        create_by: true,
        create_at: true,
        change_by: true,
        change_at: true,
        remark: true
      }
    );
  }

  async findRole(role_name: string) {
    const condition = {
      role_name: role_name,
    };
    return await this.query(
      'findRole',
      {
        collection: 'sys_role',
        condition,
      },
      { _key: true }
    );
  }

  async removeRolePage(data: any) {
    const returnField = {
      _key: true,
    };
    return await this.mutation(
      'removeRolePage', 'sys_role_page', [data], returnField);
  }

  async saveRoleName(data: any) {
    const returnField = { _key: true };
    return await this.mutation('saveSysRole', 'sys_role', [data], returnField);
  }

  async saveRoleUser(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSysRoleUser',
      'sys_role_user',
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
