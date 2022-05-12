import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';


@Injectable({
  providedIn: 'root'
})
export class CaptionListService extends AitBaseService {
  collection = 'sys_caption';
  returnFields = {
    _key: true,
    group_no: true,
    name: true,
    code: true,
    module: {
      _key: true,
      value: true,
    },
    page: {
      _key: true,
      value: true,
    },
    create_by: true,
    change_by: true,
    create_at: true,
    change_at: true,
  };
  async searchCaption(condition = {}) {
    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    if (!condition['module'])
    {
      condition['module'] = {};
    }

    if (!condition['page'])
    {
      condition['page'] = {};
    }
    condition['module']['attribute'] = 'module';
    condition['module']['ref_collection'] = 'sys_module';
    condition['module']['ref_attribute'] = '_key';
    condition['page']['attribute'] = 'page';
    condition['page']['ref_collection'] = 'sys_page';
    condition['page']['ref_attribute'] = '_key';
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'searchCaption',
      {
        collection: this.collection,
        condition: condition,
        options: { sort_by: { value: 'sort_no', order_by: 'DESC' } },
      },
      this.returnFields
    );
  }
}
