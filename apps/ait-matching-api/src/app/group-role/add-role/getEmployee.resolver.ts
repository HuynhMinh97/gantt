import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmployeeEntity } from './getEmployee.entity';
import { GetEmployeeRequest } from './getEmployee.request';
import { EmployeeResponse } from './getEmployee.response';

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
}
