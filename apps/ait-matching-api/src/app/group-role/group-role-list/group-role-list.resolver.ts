import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
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
    const aqlQuery = `
    FOR v IN  sys_role
    RETURN v
      `;
    const groupRole = await this.query(aqlQuery);
    // const groupRole = await this.find(request);
    const listData = groupRole.data;

    const groupDataList = [];
    for (const role of listData) {
      const page = await this.getRolePages(role._id);
      const module = await this.getRoleModule(role._id);
      const user = await this.getRoleUser(role._id);
      const permissions = await this.getPermissionUser(role._id);
      const userId = user.data[0];
      
      if (userId !== undefined) {
        const u = {};
        Object.keys(user.data[0]).forEach((key) => {
          if (key.includes('create') || key.includes('change')) {
            const value = user.data[0][key]
            u[key] = value;
          }
        })
        const user_id = userId['_to'].substring(userId['_to'].indexOf('/') + 1);
        const employee = await this.getEmployee(user_id);
        if (permissions.data[0] !== undefined) {
          groupDataList.push({
            ...role,
            page: page.data[0],
            employee_name: employee.data[0],
            permission: permissions.data[0].join(', '),
            module: module.data[0],
            create_at: u['create_at'],
            change_at: u['change_at'],
            create_by: u['create_by'],
            change_by: u['change_by'],
            userId: user_id,
          });
        } else {
          groupDataList.push({
            ...role,
            page: page.data[0],
            employee_name: employee.data[0],
            permission: '',
            module: module.data[0],
            create_at: u['create_at'],
            change_at: u['change_at'],
            create_by: u['create_by'],
            change_by: u['change_by'],
            userId: user_id,
          });
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

  @Query(() => GroupRoleListResponse, { name: 'getAllRoleOfEmployee' })
  async getAllRoleOfEmployee(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest })
    request: GroupRoleListRequest
  ) {

    const employeeId = request?.condition?.user_id;
    
    delete request?.condition?.user_id;
    const aqlQuery = `
    FOR v IN  sys_role
    RETURN v
      `;
    const groupRole = await this.query(aqlQuery);
    const listData = groupRole.data;

    
    const groupDataList = [];
    for (const role of listData) {
      const page = await this.getRolePages(role._id);
      const module = await this.getRoleModule(role._id);
      const user = await this.getRoleUser(role._id);
      const permissions = await this.getPermissionUser(role._id);
      const userId = user.data[0];
      if ( userId!== undefined) {
        const user_id = userId['_to'].substring(userId['_to'].indexOf('/') + 1);
        
        if (user_id === employeeId)  {
          const u = {};
          Object.keys(user.data[0]).forEach((key) => {
            if (key.includes('create') || key.includes('change')) {
              const value = user.data[0][key]
              u[key] = value;
            }
          })
          
          for (let i = 0; i < page.data.length; i++) {

            const employee = await this.getEmployee(user_id);
            if (permissions.data[0] !== undefined) {
              groupDataList.push({
                ...role,
                page: page.data[i],
                employee_name: employee.data[0],
                permission: permissions.data[0].join(', '),
                module: module.data[i],
                create_at: u['create_at'],
                change_at: u['change_at'],
                create_by: u['create_by'],
                change_by: u['change_by'],
                userId: user_id,
              });
            } else {
              groupDataList.push({
                ...role,
                page: page.data[i],
                employee_name: employee.data[0],
                permission: '',
                module: module.data[i],
                create_at: u['create_at'],
                change_at: u['change_at'],
                create_by: u['create_by'],
                change_by: u['change_by'],
                userId: user_id,
              });
            }
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
  saveSysRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => GroupRoleListResponse, { name: 'saveSysRolePage' })
  saveSysRolePage(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    return this.save(request, user);
  }


  

  async getRolePages(role_id: any) {
    const _from = role_id;
    const aqlQuery = `
        FOR v IN 1..1 OUTBOUND "${_from}" sys_role_page
        RETURN v.code
      `;
    return await this.query(aqlQuery);
  }

  async getRoleModule(role_id: any) {
    const _from = role_id;
    const aqlQuery = `
        FOR v IN 1..1 OUTBOUND "${_from}" sys_role_page
        RETURN v.module
      `;
    return await this.query(aqlQuery);
  }

  async getRoleUser(role_id: any) {
    const _from = role_id;
    const aqlQuery = `
        FOR v,e IN 1..1 OUTBOUND "${_from}" sys_role_user
        RETURN e
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
    RETURN CONCAT (v.first_name,v.last_name)
      `;
    return await this.query(aqlQuery);
  }
}
