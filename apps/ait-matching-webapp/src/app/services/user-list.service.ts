import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root',
})
export class UserListService extends AitBaseService {
  collection = 'sys_user';

  async find(condition = {}) {
    condition['del_flag'] = false;

    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    const query = await this.query(
      'getAllUser',
      {
        collection: 'sys_user',
        condition,
      },
      {
        _key: true,
        username: true,
        email: true,
        password: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
      }
    );
    return query;
  }
}
