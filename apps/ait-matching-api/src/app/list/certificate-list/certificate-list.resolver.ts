import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { CertificateListEntity } from "./certificate-list.entity";
import { CertificateListRequest } from "./certificate-list.request";
import { CertificateListResponse } from "./certificate-list.response";

@Resolver()
export class CertificateResolver extends AitBaseService {
  @Query(() => CertificateListResponse, { name: 'getAllCertificate' })
  async getAllCertificate(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CertificateListRequest })
    request: CertificateListRequest
  ) {
    return this.find(request);
  }

  @Query(() => CertificateListResponse, { name: 'GetCertificateList' })
  async GetCertificateList(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CertificateListRequest })
    request: CertificateListRequest
  ) {
    
    const username = request.condition?.employee_name?.valueAsString
      .toLocaleLowerCase()
      .trim();
    delete request.condition?.employee_name;
    const result = await this.getAllCertificate(user, request);
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
    
    const response = new CertificateListResponse(
      200,
      userArr as CertificateListEntity[],
      ''
    );
    return response;
  }
}