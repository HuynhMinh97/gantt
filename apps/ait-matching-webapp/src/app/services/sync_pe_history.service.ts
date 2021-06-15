import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class SyncPEService extends AitBaseService {
  private url = '/aureole-v/get-info-history';

  getInfoHistory = async () => {
    return this.post(this.url, {}).toPromise();
  }

}
