/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { COLLECTIONS, GRAPHQL, isObjectFull } from '@ait/shared';
import { AitBaseService } from '@ait/ui';

@Injectable()
export class AitExampleGraphqlService extends AitBaseService {
  collection = COLLECTIONS.EXAMPLE;
  returnFields = {
    _key: true,
    code: true,
    class: true,
    parent_code: true,
    sort_no: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
    name: true,
    active_flag: true,
  };

  async find(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    request['collection'] = this.collection;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_SYSTEM, request, returnFields);
  }

  async remove(data: any[], rf?: any) {
    // const returnFields = rf ? rf : this.returnFields;
    const returnFields = { _key: true };
    return await this.mutation(GRAPHQL.REMOVE_SYSTEM, this.collection, data, returnFields);
  }

  async save(data: any[], rf?: any) {
    const returnFields = rf ? rf : this.returnFields;
    return await this.mutation(GRAPHQL.SAVE_SYSTEM, this.collection, data, returnFields);
  }
}
