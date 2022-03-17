/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { COLLECTIONS, GRAPHQL, isObjectFull } from '@ait/shared';
import { AitBaseService } from './ait-base.service';

@Injectable()
export class AitUserSettingService extends AitBaseService {
  collection = COLLECTIONS.USER_SETTING;
  returnFields = {
    _key: true,
    user_id: true,
    company: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
    date_format_display: true,
    date_format_input: true,
    number_format: true,
    site_language: true,
    timezone: true,
  };

  async find(condition: any, rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_USER_SETTING, request, returnFields);
  }

  async remove(data: any[], rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    return await this.mutation(GRAPHQL.REMOVE_USER_SETTING, this.collection, data, returnFields);
  }

  async save(data: any[], rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    return await this.mutation(GRAPHQL.SAVE_USER_SETTING, this.collection, data, returnFields);
  }
}
