/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Database } from 'arangojs';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { PermissionInputDto, PermissionOutput } from '../dtos/permission.dto';
import { SysUser } from '../entities/sys-user.entity';
import { AitBaseService } from '../services/ait-base.service';

@Resolver()
export class PermissionResolver extends AitBaseService {
  constructor(db: Database, env: any) {
    super(db, env);
  }

  @Query(() => PermissionOutput, { name: 'findPermission' })
  findPermission(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => PermissionInputDto }) request: PermissionInputDto
  ) {
    return this.getPermission(request,user);
  }

}
