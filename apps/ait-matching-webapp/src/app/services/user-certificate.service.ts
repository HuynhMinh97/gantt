import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserCerfiticateService extends AitBaseService {

 
  saveUserCartificate = async (data: any[]) => {
    return await this.mutation('saveUsercertificate', 'user_certificate_award', data, { _key: true });
  }
  findUserByKey = async (user_key : string) => {
    const condition = {
      _key: user_key,
      del_flag: false
    }
    return await this.query('findUsercertificate', {collection: 'user_certificate_award',  condition    }, 
    {
      _key : true,
      name:true,
      certificate_award_number: true,
      grade: true,
      issue_by: true,
      issue_date_from: true,
      issue_date_to: true,
      description: true,
      file: true,
    })
  }

  remove = async (_key: string ) => {
    const returnFields = {_key: true };
    const data = { _key };
    return await this.mutation('removeUsercertificate', 'user_certificate_award', [data], returnFields);
  }
}
