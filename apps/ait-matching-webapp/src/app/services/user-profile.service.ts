import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends AitBaseService { 
  
  async findProfile(user_id: string){
    const condition = {
      user_id: user_id,
      del_flag: false,
    }
    condition['top_skills'] = {
      attribute: 'top_skills',
      ref_collection: 'm_skill',
      ref_attribute: '_key',
      get_by: '_key',
    }
    const specialFields = ['country', 'city'];

    specialFields.forEach((item) => {
      condition[item] = {
        attribute: item,
        ref_collection: 'sys_master_data',
        ref_attribute: 'code',
      };
    });
    condition['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: 'code',
    };
    condition['company_working'] = {
      attribute: 'company_working',
      ref_collection: 'm_company',
      ref_attribute: 'code',
    };
    return await this.query('findProfile', {collection: 'user_profile',  condition    }, 
    {
      user_id: true,
      avatar_url:true,
      background_url: true,
      last_name: true,
      first_name: true,
      title:{
        _key: true,
        value: true,
      },
      company_working:{
        _key: true,
        value: true,
      },
      city:{
        _key: true,
        value: true,
      },
      country:{
        _key: true,
        value: true,
      },
      about: true,
      top_skills:{
        _key: true,
        value: true,
      },
    })
  }
  async getFilesByFileKeys(file_key: string ) {
    if ((file_key).length !== 0) {
      try {
        const req = {
          collection: 'sys_binary_data',
          condition: {
            _key: {
              value: file_key
            }
          }
        }
        const result = await this.query('findBinaryData', req, {
          _key: true,
          data_base64: true,
          file_type: true,
          size: true,
          name: true,
          create_at: true
        });
        return result;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  async findSkillByUserId(user_id: string){
    const condition = {
      user_id: user_id,
      del_flag: false,
    }
    return await this.query('findReorderSkill', {collection: 'user_skill', condition}, 
    {
      _key: true,
      category: true,
      name: true,
    })
  }

}
