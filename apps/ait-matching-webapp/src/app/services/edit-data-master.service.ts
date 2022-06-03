import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditDataMasterService extends AitBaseService {
  returnFields = {
    _id: true,
    active_flag: true,
    collection: true,
    name: {
      en_US: true,
      ja_JP: true,
      vi_VN: true,
    },
    change_at: true,
    change_by: true,
    create_at: true,
    create_by: true,
  };
  async getRecordOfMaster(condition = {}, collection: string) {
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }

    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'findDataByKey',
      {
        collection: collection,
        condition: condition
      },
      this.returnFields
    );
  }

  async saveDataMaster(data: any, collection: string) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveDataMaster',
      collection,
      [data],
      returnField
    );
  }
}
