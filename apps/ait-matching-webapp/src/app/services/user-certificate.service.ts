import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserCerfiticateService extends AitBaseService {

 
  saveUserCartificate = async (data: any[]) => {
    return await this.mutation('saveUsercertificate', 'user_certificate_award', data, { _key: true });
  }
  saveMCartificate = async (data: any[]) => {
    return await this.mutation('saveUsercertificate', 'm_certificate_award', data, { _key: true });
  }
  
  findUserByKey = async (user_key : string, table : string) => {
    // const condition = {
    //   _key: user_key
    // }
    // const specialKeys = [
    //   'issue'];

    // specialKeys.forEach(item => {
    //   condition[item] = {
    //     attribute: item,
    //     ref_collection: 'sys_master_data',
    //     ref_attribute: 'code'
    //   }
    // })
    // return await this.query('findUsercertificate', {
    //   collection: 'user_certificate_award',
    //   condition
    // }, {
    //   _key : true,
    //   name:true,
    //   certificate: true,
    //   grade: true,
    //   issue: {
    //     _key : true,
    //     value : true
    //   },
    //   issueDate: true,
    //   immigration: true,
    //   description: true,
    //   file: true,
    // })  
    const condition = {
      id: user_key,
      del_flag: false
    }
    return await this.query('findUsercertificate', {collection: table,  condition    }, 
    {
      _key : true,
      name:true,
      certificate: true,
      grade: true,
      issue: true,
      issueDate: true,
      immigration: true,
      description: true,
      file: true,
      keyName:true,
      id:true,
    })
  }

  deleteUserByKey = async (_key: string , table:string) => {
    const returnFields = {_key: true };
    const data = { _key };
    return await this.mutation('removeUsercertificate', table, [data], returnFields);
  }
}
