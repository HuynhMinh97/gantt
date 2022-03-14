import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { LanguageListEntity } from "./language-list.entity";
import { LanguageListRequest } from "./language-list.request";
import { LanguageListResponse } from "./language-list.response";


@Resolver()
export class LanguageListResolver extends AitBaseService {

    @Query(() => LanguageListResponse, { name: 'getAllLanguage' })
    async getAllLanguage(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => LanguageListRequest })
      request: LanguageListRequest
    ) {
      return this.find(request, user);
    }

    @Query(() => LanguageListResponse, { name: 'getlanguageList' })
    async getlanguageList(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => LanguageListRequest })
      request: LanguageListRequest
    ) {
      
      const username = request.condition?.employee_name?.valueAsString
        .toLocaleLowerCase()
        .trim();
      delete request.condition?.employee_name;
      const result = await this.getAllLanguage(user, request);
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
      
      const response = new LanguageListResponse(
        200,
        userArr as LanguageListEntity[],
        ''
      );
      return response;
    }

}