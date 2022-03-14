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
      const skills = this.getSkills(data, lang);
      if (username == null) {
        if (obj) {
          userArr.push({
            ...data,
            first_name: obj.first_name,
            last_name: obj.last_name,
            skills: skills,
          });
        } else {
          userArr.push({
            ...data,
            first_name: '',
            last_name: '',
            skills: skills,
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
            skills: skills,
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
 

  async getSkills(element: any, lang: string) {
    const _from = 'biz_project/' + element._key;
    const aqlQuery = `
        FOR v IN 1..1 OUTBOUND "${_from}" biz_project_skill
        RETURN v.name.${lang}
      `;

    const result = await this.query(aqlQuery);
    return result.data.join(', ');
  }
}

