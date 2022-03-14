import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProjectListEntity } from './project-list.entity';
import { ProjectListRequest } from './project-list.request';
import { ProjectListResponse } from './project-list.response';

@Resolver()
export class ProjectListResolver extends AitBaseService {
  @Query(() => ProjectListResponse, { name: 'findAllProject' })
  async findAllProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ProjectListRequest })
    request: ProjectListRequest
  ) {
    return this.find(request);
  }

  @Query(() => ProjectListResponse, { name: 'GetProjectList' })
  async getProjectList(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ProjectListRequest })
    request: ProjectListRequest
  ) {
    const lang = request.lang;
    const username = request.condition?.username?.valueAsString
      .toLocaleLowerCase()
      .trim();
    delete request.condition?.username;
    delete request.condition?.skills;
    const result = await this.findAllProject(user, request);
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
    const response = new ProjectListResponse(
      200,
      userArr as ProjectListEntity[],
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
