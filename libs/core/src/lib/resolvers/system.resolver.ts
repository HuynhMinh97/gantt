/* eslint-disable @typescript-eslint/no-explicit-any */
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { SysUser } from '../entities/sys-user.entity';
import {
  SystemRequest,
  SystemAllLangRequest,
} from '../requests/system.request';
import {
  SystemResponse,
  SystemAllLangResponse,
} from '../responses/system.response';
import { AitBaseService } from '../services/ait-base.service';

@Resolver()
export class SystemResolver extends AitBaseService {
  constructor(db: Database, env: any) {
    super(db, env);
  }

  @Query(() => SystemResponse, { name: 'findSystem' })
  findSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SystemResponse, { name: 'saveSystem' })
  @UseGuards(GqlAuthGuard)
  saveSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => SystemResponse, { name: 'removeSystem' })
  // @UseGuards(GqlAuthGuard)
  removeSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.remove(request, user);
  }

  @Query(() => SystemAllLangResponse, { name: 'getAllMasterDataAllLanguage' })
  getAllMasterDataAllLanguage(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemAllLangRequest })
    request: SystemAllLangRequest
  ) {
    console.log(1);
    const aqlStr = `
    FOR data IN sys_master_data
    RETURN data`;
    return this.query(aqlStr);
  }
}
