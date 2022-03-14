import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { ApiConfig, Enforcement } from '../pages/interface';

@Injectable({ providedIn: 'root' })
export class SyncApiConfigService extends AitBaseService {

  private url = '/aureole-v/get-info-config';
  private saveUrl = '/aureole-v/save-api-config';
  private removeUrl = '/aureole-v/remove-api-config';
  private enforcementUrl = '/aureole-v/enforcement-webdb';

  async getSyncApiConfig() {
    return await this.post(this.url, {}).toPromise();
  }

  async saveApiConfig(data: ApiConfig[]) {
    return await this.post(this.saveUrl, { data }).toPromise();
  }

  async removeApiConfig(data: ApiConfig[]) {
    return await this.post(this.removeUrl, { data }).toPromise();
  }

  async enforcementWebDb(data: Enforcement[]) {
    return await this.post(this.enforcementUrl, { data }).toPromise();
  }

}
