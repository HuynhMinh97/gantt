import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserCerfiticateService extends AitBaseService {

 
  saveUserCartificate = async (data: any) => {
    return await this.mutation('saveUsercertificate', 'user_certificate_award', data, { _key: true });
  }
  findUserByKey = async (user_key : string) => {
    const condition = {
      _key: user_key,
      del_flag: false
    }
    const keyMasterArray = [
      {
        att: 'name',
        col: 'm_certificate_award',
      },
      {
        att: 'issue_by',
        col: 'm_training_center',
      },
    ];
  
    keyMasterArray.forEach((item) => {
      condition[item.att] = {
        attribute: item.att,
        ref_collection: item.col,
        ref_attribute: 'code'
      };
    });
    return await this.query('findUsercertificate', {collection: 'user_certificate_award',  condition    }, 
    {
      _key : true,
      name:{
        _key: true,
        value: true,
      },
     
      certificate_award_number: true,
      grade: true,
      issue_by:{
        _key: true,
        value: true,
      },
      issue_date_from: true,
      issue_date_to: true,
      description: true,
      file: true,
      user_id: true
    })
  }

  remove = async (_key: string ) => {
    const returnFields = {_key: true };
    const data = { _key };
    return await this.mutation('removeUsercertificate', 'user_certificate_award', [data], returnFields);
  }

  // user-profile
  findUserCetificateByKey = async (_key : string) => {
    const condition = {
      user_id: _key,
      del_flag: false
    }
    const keyMasterArray = [
      {
        att: 'name',
        col: 'm_certificate_award',
      },
      {
        att: 'issue_by',
        col: 'm_training_center',
      },
    ];
  
    keyMasterArray.forEach((item) => {
      condition[item.att] = {
        attribute: item.att,
        ref_collection: item.col,
        ref_attribute: 'code'
      };
    });
    return await this.query('findUsercertificate', {collection: 'user_certificate_award',  condition    }, 
    {
      _key : true,
      name:{
        _key: true,
        value: true,
      },
      issue_by:{
        _key: true,
        value: true,
      },
      issue_date_from: true,
      issue_date_to: true, 
      user_id: true
    })
  }

}
