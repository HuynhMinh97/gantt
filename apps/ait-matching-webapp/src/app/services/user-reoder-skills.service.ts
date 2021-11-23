import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserReoderSkillsService extends AitBaseService{
  collection = 'user_skill';
  async findSkill(_from: string){
    const condition = {
      _from: _from,
      del_flag: false,
    }
    return await this.query('findUserSkill', {collection: this.collection,  condition    }, 
    {
      _to: true
    })
  }
  // async findReorderSkill(key: string){
  //   const condition = {
  //     _key: key,
  //     del_flag: false,
  //   }
  //   return await this.query('findReorderSkill', {collection: 'm_skill',  condition }, 
  //   {
  //     _key: true,
  //     name: true,
  //     category: true
  //   })
  // }
  

  async saveUserSkillReorder(data: any) { 
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserSkillReorder',
      this.collection,
      [data],
      returnField
    );
  }

  async updateTopSkill(data: any[]){
    console.log(data);
    
    const returnField = { _key: true };
    return await this.mutation(
      'UpdateTopSkill',
      'user_profile',
      data,
      returnField
    );
  }

  async removeUserSkillReorder(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserSkill',
      this.collection,
      data,
      returnFields
    );
  }

  async findReorder(from: string){
    const condition = {
      _from: from,
      del_flag: false,
    }
    return await this.query('findReorderSkill', {collection: 'user_skill', condition}, 
    {
      _key: true,
      category: {
        _key: true,
        value: true
      },
      name: true,
    })
  }

  async findTopSkills(_key: string) {
    const condition = {
      user_id: _key,
      del_flag: false
    }
      condition['skills'] = {
        attribute: 'top_skills',
        ref_collection: 'm_skill',
        ref_attribute: '_key',
        get_by: '_key',
      }

      return await this.query(
          'findReorder',
          {
              collection: 'user_profile',
              condition               
          },
          {
              _key: true,
              top_skills:{
                _key: true,
                value: true
              },
          }
      );
  }
}


