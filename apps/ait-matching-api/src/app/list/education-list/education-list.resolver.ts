import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { EducationListEntity } from './education-list.entity';
import { EducationListRequest } from './education-list.request';
import { EducationListResponse } from './education-list.response';

@Resolver()
export class EducationListResolver extends AitBaseService {
  @Query(() => EducationListResponse, { name: 'getAllUserEducation' })
  async getAllUserEducation(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => EducationListRequest })
    request: EducationListRequest
  ) {
    return this.find(request);
  }

  @Query(() => EducationListResponse, { name: 'getListEducation' })
  async getListEducation(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => EducationListRequest })
    request: EducationListRequest
  ) {
    const lang = request.lang;
    const username = request.condition?.employee_name?.valueAsString
      .toLocaleLowerCase()
      .trim();
    delete request.condition?.employee_name;
    const result = await this.getAllUserEducation(user, request);
    const listData = result.data;

    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const userArr = [];
    listData.forEach((data) => {
      const obj = userList.find((u) => u.user_id === data.user_id);
      if (username == null) {
        if (obj) {
          userArr.push({
            ...data,
            first_name: obj.first_name,
            last_name: obj.last_name,
          });
        } else {
          userArr.push({
            ...data,
            first_name: '',
            last_name: '',
          });
        }
      } else {
        if (
          obj.first_name.toLocaleLowerCase().includes(username) ||
          obj.last_name.toLocaleLowerCase().includes(username)
        ) {
          userArr.push({
            ...data,
            first_name: obj.first_name,
            last_name: obj.last_name,
          });
        }
      }
    });
    const response = new EducationListResponse(
      200,
      userArr as EducationListEntity[],
      ''
    );
    return response;
  }
 

 
}

