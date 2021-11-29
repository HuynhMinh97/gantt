import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AitBaseService {

 
  saveJobInfo = async (data: any[]) => {
    return this.mutation('saveJobInfo', 'biz_job', data, { _key: true });
  }
}
