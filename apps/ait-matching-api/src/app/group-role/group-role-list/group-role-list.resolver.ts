import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { isArrayFull } from '@ait/shared';
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
    const groupRole = await this.find(request);
    const listData = groupRole.data;
    const groupDataList = [];
    for (const role of listData) {
      const page = await this.getRolePages(role._id);
      const module = await this.getRoleModule(role._id);
      const user = await this.getRoleUser(role._id);
      const permissions = await this.getPermissionUser(role._id);
      const employeeList = user.data;
      for (const emp of employeeList) {
        if (emp !== undefined) {
          const u = {};
          Object.keys(emp).forEach((key) => {
            if (key.includes('create') || key.includes('change')) {
              const value = emp[key]
              u[key] = value;
            }
          })
          const user_id = emp['_to'].substring(emp['_to'].indexOf('/') + 1);
          const employee = await this.getEmployee(user_id);
          if (permissions.data[0] !== undefined) {
            groupDataList.push({
              ...role,
              page: page.data[0],
              employee_name: employee.data[0],
              permission: permissions.data[0].join(', '),
              module: module.data[0],
              create_at: role.create_at,
              change_at: role.change_at,
              create_by: role.create_by,
              change_by: role.change_by,
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
  ){
    const employeeName = request?.condition?.employee_name?.valueAsString;
    const permission = request?.condition?.permission?.value;
    delete request?.condition?.employee_name;
    delete request?.condition?.permission;
    const allRole = await this.getAllRole(user,request);
    let arrRole = []
    allRole.data.forEach((role) => {
      if (employeeName) {
        if (role.employee_name.toLocaleLowerCase().includes(employeeName.toLocaleLowerCase()))
        {
          arrRole.push({...role});
        }
      }
    })
    if (isArrayFull(arrRole)){
      const data = arrRole
      if (isArrayFull(permission)){
        data.forEach((role,index) =>{
          permission.forEach((per) => {
            if (!role.permission.includes(per))
            {
              delete arrRole[index]
            }
          })
        })
      }
    }
    else {
      arrRole = allRole.data;
      if (isArrayFull(permission)){
        allRole.data.forEach((role,index) =>{
          permission.forEach((per) => {
            if (!role.permission.includes(per))
            {
              delete arrRole[index]
            }
          })
        })
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

    const role_key = request?.condition?.role_key;
    
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
      const employeeList = user.data;
      const rq = { ...request };
      rq['collection'] = 'user_profile';
      delete rq.condition;
      const res = await this.find(rq);
      const userList = res.data || [];
      
      for (const emp of employeeList) {

        if ( emp!== undefined) {
          const user_id = emp['_to'].substring(emp['_to'].indexOf('/') + 1);
          if (role._key === role_key)  {
            const u = {};
            Object.keys(emp).forEach((key) => {
              if (key.includes('create') || key.includes('change') || key.includes('name')) {
                const value = emp[key]
                u[key] = value;
              }
            })
            let createBy: any;
            let changeBy: any;
            userList.forEach((u) => {
              if (u.user_id === u['create_by']){
                createBy = u;
              }
              if (u.user_id === u['change_by']){
                changeBy = u;
              }
            })
            // const createBy =await userList.find((u) => u.user_id === u['create_by']);
            // const changeBy =await userList.find((u) => u.user_id === u['change_by']);
            // console.log(u['create_by']);
            // console.log(createBy.user_id);
            for (let i = 0; i < page.data.length; i++) {
  
              const employee = await this.getEmployee(user_id);
              if (permissions.data[0] !== undefined) {
                groupDataList.push({
                  ...role,
                  child_name:u['name'],
                  page: page.data[i],
                  employee_name: employee.data[0],
                  permission: permissions.data[0].join(', '),
                  module: module.data[i],
                  create_at: u['create_at'],
                  change_at: u['change_at'],
                  create_by: createBy.first_name + ' ' + createBy.last_name,
                  change_by: changeBy.first_name + ' ' + changeBy.last_name,
                  remark: role.remark,
                });
              } else {
                groupDataList.push({
                  ...role,
                  child_name:u['name'],
                  page: page.data[i],
                  employee_name: employee.data[0],
                  permission: '',
                  module: module.data[i],
                  create_at: u['create_at'],
                  change_at: u['change_at'],
                  create_by: createBy.first_name + ' ' + createBy.last_name,
                  change_by: changeBy.first_name + ' ' + changeBy.last_name,
                  remark: role.remark,
                });
              }
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
  async saveSysRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    const roleName = await this.save(request, user);
    return this.save(request, user);
  }

  @Mutation(() => GroupRoleListResponse, { name: 'saveSysRolePage' })
  saveSysRolePage(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => GroupRoleListResponse, { name: 'saveSysRoleUser' })
  saveSysRoleUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    return this.save(request, user);
  }

  
  @Query(() => GroupRoleListResponse, { name: 'findRole' })
  async findRole(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    const role_name = request?.condition?.role_name
    delete request?.condition?.role_name;
    const aqlQuery = 
    `for v in sys_role
    filter v.name == "${role_name}"
    return v`;
    const result = await this.query(aqlQuery);
    return result
  }
  
  @Query(() => GroupRoleListResponse, { name: 'findRolePage' })
  async findRolePage(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GroupRoleListRequest }) request: GroupRoleListRequest
  ) {
    const _from = request?.condition?._from
    const module = request?.condition?.module
    delete request?.condition?.role_name;
    delete request?.condition?.module;
    const aqlQuery = 
    `for v in sys_role_page
    filter v._from == "${_from}" && v.module == "${module}"
    return v
    `;
    const result = await this.query(aqlQuery);
    return result
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

  // @Query(() => UserSkillResponse, { name: 'getRoleUser' })
  // findUserSkill(
  //   @AitCtxUser() user: SysUser,
  //   @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  // ) {
  //   return this.find(request, user);
  // }

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
    RETURN CONCAT (v.first_name,' ',v.last_name)
      `;
    return await this.query(aqlQuery);
  }
}
