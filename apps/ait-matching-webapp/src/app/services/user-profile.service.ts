import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends AitBaseService { 
  public onLoad = new BehaviorSubject(null);
  async findProfile(user_id: string){
    const condition = {
      user_id: user_id,
      del_flag: false,
    }
    const specialFields = ['country_region', 'province_city'];

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
      last_name: true,
      first_name: true,
      phone_number: true,
      romaji: true,
      katakana: true,
      bod: true,
      about: true,
      gender: true,
      // avatar_url:true,
      // background_url: true,
      
      // title:{
      //   _key: true,
      //   value: true,
      // },
      // company_working:{
      //   _key: true,
      //   value: true,
      // },
      // province_city:{
      //   _key: true,
      //   value: true,
      // },
      // country_region:{
      //   _key: true,
      //   value: true,
      // },
      
    })
  }

  async findTopSkill(user_id: string){
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
    return await this.query('findProfile', {collection: 'user_profile',  condition    }, 
    {
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

  async finProfileByUserId(user_id: string){
    const condition = {
      user_id: user_id,
      del_flag: false,
    }
    return await this.query('findProfile', {collection: 'user_profile', condition}, 
    {
      _key: true,
    })
  }
  async getCountFriends(to: string){
    const condition = {
      _to: to,
      del_flag: false,
    }
    return await this.query('findFriends', {collection: 'reaction_love', condition}, 
    {
      _key: true,
    })
  }
  async getFriends(from: string){
    const condition = {
      _from: from,
      del_flag: false,
    }
    return await this.query('findFriends', {collection: 'reaction_love', condition}, 
    {
      _key: true,
    })
  }

  async saveFriends(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveFriends',
      'reaction_love',
      [data],
      returnField
    );
  }
  async removeFriends(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeFriends',
      'reaction_love',
      data,
      returnFields
    );
  }

  async getCategorySkill(classCategory: string){
    const condition = {
      class: classCategory,
      del_flag: false,
    }
    return await this.query('findFriends', {collection: 'reaction_love', condition}, 
    {
      _key: true,
    })
  }

}
