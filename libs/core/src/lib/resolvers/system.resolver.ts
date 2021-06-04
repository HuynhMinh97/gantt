import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { SysUser } from '../entities/sys-user.entity';
import { SystemRequest } from '../requests/system.request';
import { SystemResponse } from '../responses/system.response';
import { AitBaseService } from '../services/ait-base.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class SystemResolver extends AitBaseService {
  constructor(db: Database) {
    super(db);
  }

  @Query(() => SystemResponse, { name: 'findSystem' })
  findSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SystemResponse, { name: 'saveSystem' })
  saveSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => SystemResponse, { name: 'removeSystem' })
  removeSystem(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SystemRequest }) request: SystemRequest
  ) {
    return this.remove(request, user);
  }
}
