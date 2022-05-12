import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CaptionRegisterRequest,
  CaptionRegisterSaveRequest,
} from './add-caption.request';
import { CaptionRegisterResponse, CaptionResponse } from './add-Caption.response';

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
    console.log(await this.query(gql));
    return this.query(gql);
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
