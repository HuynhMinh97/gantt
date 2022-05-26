import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterListService  extends AitBaseService{
  returnFields = {
    _key: true,
    _id: true,
    active_flag: true,
    collection: true,
    name: true,
    status: true,
    create_by: true,
    change_by: true,
    create_at: true,
    change_at: true,
  }
  async searchRecordOfMaster(condition = {}, collection: string) {
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'getAllRecordOfMaster',
      {
        collection: collection,
        condition: condition,
        options: { sort_by: { value: '_id', order_by: 'DESC' } },
      },
      this.returnFields
    );
  }
}
