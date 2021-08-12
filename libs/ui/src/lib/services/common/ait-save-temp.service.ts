/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObjectFull, SysSaveTemp } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AitSaveTempService extends AitBaseService {
  collection = 'sys_save_temp';
  find_name = 'findSysSaveTemp';
  save_name = 'saveSysSaveTemp';
  remove_name = 'removeSysSaveTemp';

  returnFields = {
    company: true,
    _key: true,
    user_id: true,
    module: true,
    page: true,
    data: true,
  };

  async find(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(this.find_name, request, returnFields);
  }

  async save(data: SysSaveTemp[], rf? : any) {
    const returnFields = rf ? rf : this.returnFields;
    return await this.mutation(this.save_name, this.collection, data, returnFields);
  }

  async remove(_key: string) {
    const returnFields = { _key: true };
    const data = [{_key}];
    return await this.mutation(this.remove_name, this.collection, data, returnFields);
  }
}
