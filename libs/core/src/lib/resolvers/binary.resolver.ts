/* eslint-disable @typescript-eslint/no-explicit-any */
import { COLLECTIONS, KEYS } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { SysUser } from '../entities/sys-user.entity';
import { AitBaseService } from '../services/ait-base.service';
import { BinaryResponse } from '../responses/binary.response';
import {
  BinaryRemoveRequest,
  BinaryRequest,
  BinarySaveRequest,
} from '../requests/binary.request';
import { AitUtils } from '../utils/ait-utils';

@Resolver()
@UseGuards(GqlAuthGuard)
export class BinaryResolver extends AitBaseService {
  constructor(db: Database, env: any) {
    super(db, env);
  }
  collection: string = COLLECTIONS.SYS_BINARY_DATA;

  @Query(() => BinaryResponse, { name: 'findBinaryData' })
  findBinaryData(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BinaryRequest }) request: BinaryRequest
  ) {
    request['colection'] = this.collection;
    return this.find(request, user);
  }

  @Mutation(() => BinaryResponse, { name: 'saveBinaryData' })
  async saveBinaryData(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BinarySaveRequest })
    request: BinarySaveRequest
  ) {
    request['colection'] = this.collection;
    const dataInsert = [];
    const collection = request.collection;
    request.data.forEach((data: any) => {
      data[KEYS.DEL_FLAG] = false;
      data[KEYS.COMPANY] = request.company;
      data[KEYS.CREATE_BY] = user?._key || request?.user_id || KEYS.ADMIN;
      data[KEYS.CHANGE_BY] = user?._key || request?.user_id || KEYS.ADMIN;
      data[KEYS.CREATE_AT] = AitUtils.getUnixTime();
      data[KEYS.CHANGE_AT] = AitUtils.getUnixTime();
      dataInsert.push(data);
    });

    const aqlStr = `
          FOR data IN ${JSON.stringify(dataInsert)}
          INSERT data INTO ${collection} 
          RETURN data `;
    
    return await this.query(aqlStr);
  }

  @Mutation(() => BinaryResponse, { name: 'removeBinaryData' })
  removeBinaryData(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BinaryRemoveRequest })
    request: BinaryRemoveRequest
  ) {
    request['colection'] = this.collection;
    return this.remove(request, user);
  }
}
