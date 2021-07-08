import { COLLECTIONS } from '@ait/shared';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { SysUser } from '../entities/sys-user.entity';
import { AitBaseService } from '../services/ait-base.service';
import { BinaryResponse } from '../responses/binary.response';
import { BinaryRemoveRequest, BinaryRequest, BinarySaveRequest } from '../requests/binary.request';
import { BinaryDataSaveDto } from '../dtos/binary-data.dto';

@Resolver()
// @UseGuards(GqlAuthGuard)
export class BinaryResolver extends AitBaseService {
  constructor(db: Database) {
    super(db);
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
    @Args('request', { type: () => BinarySaveRequest }) request: BinarySaveRequest
  ) {
    request['colection'] = this.collection;
    return await this.save(request, user);
  }

  @Mutation(() => BinaryResponse, { name: 'removeBinaryData' })
  removeBinaryData(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BinaryRemoveRequest }) request: BinaryRemoveRequest
  ) {
    request['colection'] = this.collection;
    return this.remove(request, user);
  }
}
