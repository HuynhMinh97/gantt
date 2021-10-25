/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AitCtxUser } from '../decorators/ait-ctx-user.decorator';
import { SaveTempDto } from '../dtos/save-temp.dto';
import { SysUser } from '../entities/sys-user.entity';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { SaveTempRequest } from '../requests/save-temp.request';
import { SaveTempResponse } from '../responses/save-temp.response';
import { AitBaseService } from '../services/ait-base.service';

@Resolver()
export class SaveTempResolver extends AitBaseService {
  collection = 'sys_save_temp';

  @Query(() => SaveTempResponse, { name: 'findSaveTemp' })
  findSaveTemp(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveTempRequest })
    request: SaveTempRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SaveTempResponse, { name: 'saveSaveTemp' })
  async saveSaveTemp(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveTempRequest })
    request: SaveTempRequest
  ) {
    const data = request.data[0];
    this.initialize(request, user);

    const isDataExists = await this.isDataExist(request, data);
    data['user_id'] = request.user_id;
    
    if (isDataExists) {
      this.setCommonUpdate(data);
    } else {
      this.setCommonInsert(data);
    }
    
    let aqlStr = `
        LET data_saved = (
          UPSERT {
            user_id: "${data.user_id}",
            page: "${data.page}",
            module: "${data.module}",
            mode: "${data.mode}" `;

    if (data.mode === "EDIT") {
      aqlStr += `,
            edit_id: "${data.edit_id}"`;
    }
    
    aqlStr +=`
          }
          INSERT ${JSON.stringify(data)}
          UPDATE ${JSON.stringify(data)}
          IN ${this.collection}
          RETURN NEW
        )
        RETURN data_saved[0]
      `;
    return await this.query(aqlStr);
  }

  @Mutation(() => SaveTempResponse, { name: 'removeSaveTemp' })
  async removeSaveTemp(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SaveTempRequest })
    request: SaveTempRequest
  ) {
    const aqlStr = `
      FOR data IN ${JSON.stringify(request.data)}
      REMOVE data._key IN ${this.collection}
      LET removed = OLD
      RETURN removed
    `;

    return await this.query(aqlStr);
  }

  private async isDataExist(request: SaveTempRequest, data: SaveTempDto) {
    let aqlStr = `
        FOR data IN ${this.collection}
          FILTER data.company == "${request.company}"
              && data.user_id == "${request.user_id}"
              && data.page == "${data.page}"
              && data.module == "${data.module}"
              && data.mode == "${data.mode}"
              && data.is_matching == true
              && data.del_flag == false `;
    if (data.mode === 'EDIT') {
      aqlStr += `
        && data.edit_id == "${data.edit_id}"
        `;
    }
    aqlStr += `RETURN data`;
    const result = await this.query(aqlStr);
    return result.numData !== 0;
  }
}
