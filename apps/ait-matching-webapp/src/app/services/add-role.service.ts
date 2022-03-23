import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddRoleService extends AitBaseService {
  async getEmployee() {
    const condition = {
      del_flag: false
    };
    condition['type'] = {}
    condition['type']['operator'] = 'IN'
    condition['type']['value'] = '03';

    return await this.query(
      'getAllEmployee',
      {
        collection: 'sys_user',
        condition
      },
      {
        _key: true,
        full_name: true,
      }
    );
  }
}
