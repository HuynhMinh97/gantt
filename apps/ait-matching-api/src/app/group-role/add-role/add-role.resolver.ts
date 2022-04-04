import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GroupRoleListRequest } from '../group-role-list/group-role-list.request';
import { GroupRoleListResponse } from '../group-role-list/group-role-list.response';
import { EmployeeEntity } from './add-role.entity';
import { GetEmployeeRequest, RoleUserInfoRequest } from './add-role.request';
import { EmployeeResponse, RoleUserInfoResponse } from './add-role.response';

@Resolver()
export class GetEmployeeResolver extends AitBaseService {
  @Query(() => EmployeeResponse, { name: 'getAllEmployee' })
  async getAllEmployee(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GetEmployeeRequest })
    request: GetEmployeeRequest
  ) {
    const result = await this.find(request);
    const listData = result.data;

    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const userArr = [];
    listData.forEach((data) => {
      const obj = userList.find((u) => u.user_id === data._key);
      if (obj) {
        userArr.push({
          _key: data._key,
          full_name: obj.first_name + ' ' + obj.last_name,
        });
      } else {
        userArr.push({
          _key: data._key,
          full_name: '',
        });
      }
    });
    const response = new EmployeeResponse(200, userArr as EmployeeEntity[], '');
    return response;
  }

  @Query(() => RoleUserInfoResponse, { name: 'getRoleUserInfo' })
  async getRoleUserInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => RoleUserInfoRequest })
    request: RoleUserInfoRequest
  ) {
    const lang = request.lang;
    const result = await this.find(request);
    const listData = result.data[0];
    const roleKey = listData['_from'].substring(
      listData['_from'].indexOf('/') + 1
    );
    const user_id = listData['_to'].substring(listData['_to'].indexOf('/') + 1);
    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const employee = [];
    const obj = userList.find((u) => u.user_id === user_id);
    if (obj) {
      employee.push({
        _key: user_id,
        value: obj.first_name + ' ' + obj.last_name,
      });
    } else {
      employee.push({
        _key: user_id,
        value: '',
      });
    }
    const module = await this.getModule(listData['module']);
    const page = await this.getPage(listData['page']);
    const permissionObj = await this.findPermission(lang);
    console.log(permissionObj);
    const permissionArr = [];
    permissionObj.data.forEach((permission) => {
      listData['permission'].forEach((per) => {
        if (permission['_key'] === per) {
          permissionArr.push(permission);
        }
      });
    });
    const roleUserInfo = [];
    roleUserInfo.push({
      role_key:roleKey,
      _key: listData['_key'] ,
      name: listData['name'],
      remark: listData['remark'],
      module: module.data[0],
      page: page.data[0],
      employee_name: employee[0],
      permission: permissionArr,
    });

    const response = new EmployeeResponse(
      200,
      roleUserInfo as EmployeeEntity[],
      ''
    );
    return response;
  }

 

  @Mutation(() => GroupRoleListResponse, { name: 'removeRoleUser' })
  removeRoleUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    return this.remove(request, user);
  }

  async getModule(_key: any) {
    const aqlQuery = `
    for v in sys_module
    filter v._key == "${_key}"
    return {_key:v._key, value: v.name}
      `;
    return await this.query(aqlQuery);
  }

  async getPage(_key: any) {
    const aqlQuery = `
    for v in sys_page
    filter v._key == "${_key}"
    return {_key:v._key, value: v.name}
      `;
    return await this.query(aqlQuery);
  }

  async findPermission(lang: string) {
    const aqlQuery = `
    for v in sys_master_data
    filter v.class == "ROLE_PERMISSION"
    return {_key:v._key, value: v.name.${lang}}`;
    return await this.query(aqlQuery);
  }
}
