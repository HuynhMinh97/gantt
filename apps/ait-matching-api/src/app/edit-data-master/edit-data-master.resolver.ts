import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DataMasterEntity } from "./edit-data-master.entity";
import { DataMasterRequest } from "./edit-data-master.request";
import { DataMasterResponse } from "./edit-data-master.response";


@Resolver()
export class DataMasterResolver extends AitBaseService {

  @Query(() => DataMasterResponse, { name: 'findDataByKey' })
  async findDataByKey(
    @Args('request', { type: () => DataMasterRequest })
    request: DataMasterRequest
  ) {
    const _key =  request.condition?._key;
    const collection = request.collection
    const gql=`
      FOR data IN ${collection}
      FILTER data._key == "${_key}"
      return data || ''
    `;
    
    const data = await this.query(gql);
    console.log(data);
    const result = await this.find(request);
    const userArr = [];
    userArr.push({
      _id: data.data[0]?._id,
      name:data.data[0]?.name,
      change_at: data.data[0]?.change_at,
      change_by: result.data[0]?.change_by,
      create_at: data.data[0]?.create_at,
      create_by: result.data[0]?.create_by,
      active_flag: result.data[0]?.active_flag,
    });
    const response = new DataMasterResponse(
      200, 
      userArr as DataMasterEntity[], 
      ''
      )
    return response;
    
    // return this.query(gql);
  }

  @Mutation(() => DataMasterResponse, { name: 'saveDataMaster' })
  saveDataMaster(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => DataMasterRequest })
    request: DataMasterRequest
  ) {
    return this.save(request);
  }
}