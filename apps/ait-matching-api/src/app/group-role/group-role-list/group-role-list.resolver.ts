import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { isArrayFull, isObjectFull } from '@ait/shared';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GroupRoleListEntity } from './group-role-list.entity';
import { GroupRoleListRequest } from './group-role-list.request';
import { GroupRoleListResponse } from './group-role-list.response';

@Resolver()
export class GroupRoleListResolver extends AitBaseService {
  @Query(() => GroupRoleListResponse, { name: 'getAllRole' })
  async getAllRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    const lang = request.lang;
    const groupRole = await this.find(request);
    const listData = groupRole.data;
    const groupDataList = [];
    for (const role of listData) {
      const user = await this.getRoleUser(role._id);
      const employeeList = user.data;
      for (const emp of employeeList) {
        if (emp !== undefined) {
          const user_id = emp['_to'].substring(emp['_to'].indexOf('/') + 1);
          const employee = await this.getEmployee(user_id);
         
          const permissions = emp['permission'];
          
          const permissionName = []
          for (const per of permissions) {
            
            const result = await this.getPermissionName(per,lang);
            
            permissionName.push(result.data[0]);
          }
          const obj = groupDataList.find(
            (data) => data.employee_name === employee.data[0]
          );
          if (permissions !== undefined && !isObjectFull(obj)) {
            groupDataList.push({
              ...role,
              userId: user_id,
              employee_name: employee.data[0],
              permission: permissionName.join(', '),
              create_at: role.create_at,
              change_at: role.change_at,
              create_by: role.create_by,
              change_by: role.change_by,
            });
          }
        }
      }
    }

    const response = new GroupRoleListResponse(
      200,
      groupDataList as GroupRoleListEntity[],
      ''
    );

    return response;
  }

  @Query(() => GroupRoleListResponse, { name: 'searchRole' })
  async searchRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    const employeeName = request?.condition?.employee_name?.valueAsString;
    const permission = request?.condition?.permission?.value;
    delete request?.condition?.employee_name;
    delete request?.condition?.permission;
    const allRole = await this.getAllRole(user, request);
    let arrRole = [];
    if (employeeName) {
      allRole.data.forEach((role) => {
        if (
          role.employee_name
            .toLocaleLowerCase()
            .includes(employeeName.toLocaleLowerCase())
        ) {
          arrRole.push({ ...role });
        }
      });
      if (isArrayFull(arrRole)) {
        const data = arrRole;
        if (isArrayFull(permission)) {
          data.forEach((role, index) => {
            permission.forEach((per) => {
              if (!role.permission.includes(per)) {
                delete arrRole[index];
              }
            });
          });
        }
      } else {
        const response = new GroupRoleListResponse(
          200,
          arrRole as GroupRoleListEntity[],
          ''
        );

        return response;
      }
    } else {
      arrRole = allRole.data;
      if (isArrayFull(permission)) {
        allRole.data.forEach((role, index) => {
          permission.forEach((per) => {
            if (!role.permission.includes(per)) {
              delete arrRole[index];
            }
          });
        });
      }
    }

    const response = new GroupRoleListResponse(
      200,
      arrRole as GroupRoleListEntity[],
      ''
    );

    return response;
  }

  @Query(() => GroupRoleListResponse, { name: 'getAllRoleOfGroupRole' })
  async getAllRoleOfGroupRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    const lang = request?.lang;
    const role_key = request?.condition?.role_key;
    const employee_key = request?.condition?.employee_key;

    delete request?.condition?.user_id;
    const aqlQuery = `
    FOR v IN  sys_role
    RETURN v
      `;
    const groupRole = await this.query(aqlQuery);
    const listData = groupRole.data;

    const groupDataList = [];
    const roleGroup = [];
    listData.forEach((role) => {
      if (role._key === role_key) {
        roleGroup.push(role);
      }
    });

    const roleUser = await this.getRoleUser(roleGroup[0]._id);
    const employeeList = roleUser.data;
    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];

    for (const emp of employeeList) {
      if (emp) {
        const user_id = emp['_to'].substring(emp['_to'].indexOf('/') + 1);
        if (roleGroup[0]._key === role_key) {
          const u = {};
          let createBy: any;
          let changeBy: any;
          userList.forEach((u) => {
            if (u.user_id === emp['create_by']) {
              createBy = u;
            }
            if (u.user_id === emp['change_by']) {
              changeBy = u;
            }
          });
          const employee = await this.getEmployee(user_id);
          const module = (await this.getModuleName(emp['module'])) || null;
          const page = (await this.getPageName(emp['page'])) || null;
          const permissions = emp['permission'];
          
          const permissionName = []
          for (const per of permissions) {
            
            const result = await this.getPermissionName(per,lang);
            
            permissionName.push(result.data[0]);
          }
          
          if (permissions !== undefined && employee_key === user_id) {
            groupDataList.push({
              ...roleGroup[0],
              child_name: emp['name'],
              page: page.data.join(', '),
              employee_name: employee.data[0],
              permission: permissionName.join(', '),
              module: module.data.join(', '),
              create_at: emp['create_at'],
              change_at: emp['change_at'],
              create_by: createBy.first_name + ' ' + createBy.last_name,
              change_by: changeBy.first_name + ' ' + changeBy.last_name,
              remark: roleGroup[0].remark,
              roleUser_key: emp['_key'],
            });
          }
        }
      }
    }
    const response = new GroupRoleListResponse(
      200,
      groupDataList as GroupRoleListEntity[],
      ''
    );

    return response;
  }

  @Mutation(() => GroupRoleListResponse, { name: 'saveSysRole' })
  async saveSysRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    const roleName = await this.save(request, user);
    return this.save(request, user);
  }

  @Mutation(() => GroupRoleListResponse, { name: 'saveSysRoleUser' })
  saveSysRoleUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    return this.save(request, user);
  }

  @Query(() => GroupRoleListResponse, { name: 'findRole' })
  async findRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {
    const role_name = request?.condition?.role_name;
    delete request?.condition?.role_name;
    const aqlQuery = `for v in sys_role
    filter v.name == "${role_name}"
    return v`;
    const result = await this.query(aqlQuery);
    return result;
  }
  async getRoleUser(role_id: any) {
    const _from = role_id;
    const aqlQuery = `
        FOR v,e IN 1..1 OUTBOUND "${_from}" sys_role_user
        filter e.del_flag == false
        RETURN e
      `;
    return await this.query(aqlQuery);
  }

  async getModuleName(_key: any) {
    const aqlQuery = `
    for v in sys_module
    filter v._key == "${_key}"
    return v.name
      `;
    return await this.query(aqlQuery);
  }

  async getPermissionName(_key: any, lang: string) {
    const aqlQuery = `
    for v in sys_master_data
    filter v._key == "${_key}"
    return v.name.${lang}
      `;
      
    return await this.query(aqlQuery);
  }

  async getPageName(_key: any) {
    const aqlQuery = `
    for v in sys_page
    filter v._key == "${_key}"
    return v.name
      `;
    return await this.query(aqlQuery);
  }

  async getPermissionUser(role_id: any) {
    const _from = role_id;
    const aqlQuery = `
        FOR v,e IN 1..1 OUTBOUND "${_from}" sys_role_user
        RETURN  e.permission 
      `;
    return await this.query(aqlQuery);
  }
  async getEmployee(user_id: any) {
    const aqlQuery = `
    FOR v IN  user_profile
    FILTER v.user_id == "${user_id}"
    RETURN CONCAT (v.first_name,' ',v.last_name)
      `;
    return await this.query(aqlQuery);
  }
}
