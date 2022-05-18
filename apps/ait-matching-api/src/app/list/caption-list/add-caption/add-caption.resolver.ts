import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CaptionEntity } from './add-caption.entity';
import {
  CaptionRegisterRequest,
  CaptionRegisterSaveRequest,
} from './add-caption.request';
import { CaptionRegisterResponse, CaptionResponse } from './add-caption.response';

@Resolver()
export class CaptionRegisterResolver extends AitBaseService {
  @Query(() => CaptionResponse, { name: 'findCaptionByKey' })
  async findCaptionByKey(
    @Args('request', { type: () => CaptionRegisterRequest })
    request: CaptionRegisterRequest
  ) {
    const _key =  request.condition?._key;
    const gql=`
      FOR data IN sys_caption
      FILTER data._key == "${_key}"
      return data
    `;
    const caption = await this.query(gql);
    const result = await this.find(request);
    const userArr = [];
    userArr.push({
      name:caption.data[0]?.name,
      module: caption.data[0]?.module,
      code: caption.data[0]?.code,
      page: caption.data[0]?.page,
      change_at: caption.data[0]?.change_at,
      change_by: result.data[0]?.change_by,
      create_at: caption.data[0]?.create_at,
      create_by: result.data[0]?.create_by
    });
    const response = new CaptionResponse(
      200, 
      userArr as CaptionEntity[], 
      ''
      )
    return response;
    
    // return this.query(gql);
  }
  @Mutation(() => CaptionRegisterResponse, { name: 'saveCaption' })
  saveCaption(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionRegisterSaveRequest })
    request: CaptionRegisterSaveRequest
  ) {
    return this.save(request);
  }
  
}
