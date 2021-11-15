import { Args, Query, Resolver } from '@nestjs/graphql';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { SysUser } from '../entities/sys-user.entity';
import {
  SysGroupRequest,
  SysModuleRequest,
  SysPageRequest,
  SysSearchConditionRequest,
  SysSearchResultRequest,
} from '../requests/page-render.request';
import {
  SysGroupResponse,
  SysModuleResponse,
  SysPageResponse,
  SysSearchConditionResponse,
  SysSearchResultResponse,
} from '../responses/page-render.response';
import { AitBaseService } from '../services/ait-base.service';

@Resolver()
export class PageRenderResolver extends AitBaseService {
  @Query(() => SysGroupResponse, { name: 'findSysGroup' })
  findSysGroup(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SysGroupRequest })
    request: SysGroupRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => SysModuleResponse, { name: 'findSysModule' })
  findSysModule(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SysModuleRequest })
    request: SysModuleRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => SysPageResponse, { name: 'findSysPage' })
  findSysPage(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SysPageRequest })
    request: SysPageRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => SysSearchConditionResponse, { name: 'findSysSearchCondition' })
  findSysSearchCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SysSearchConditionRequest })
    request: SysSearchConditionRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => SysSearchResultResponse, { name: 'findSysSearchResult' })
  findSysSearchResult(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SysSearchResultRequest })
    request: SysSearchResultRequest
  ) {
    return this.find(request, user);
  }
}
