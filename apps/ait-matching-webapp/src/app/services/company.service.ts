import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompanyService extends AitBaseService {

  private getUrl = '/company/get';

  getCompany = async (listKeys: string[]) => {
    return this.post(this.getUrl, {
      condition: {
        _key: listKeys
      }
    }).toPromise();
  }

  getCompanys = async (name_pe: string | any) => {
    return this.post(this.getUrl, {
      condition: {
        name_pe
      }
    }).toPromise();
  }
}
