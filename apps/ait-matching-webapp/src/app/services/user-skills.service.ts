import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSkillsService extends AitBaseService{
  collection = 'user_skill';

  async getMaxSkill(code: any){
    const condition = {
      code: code,
      del_flag: false,
    }
    return await this.query('findSystem', {collection: 'sys_master_data',  condition    }, 
    {
      name:true,
    })
  }

  async findSkill(_from: string){
    const condition = {
      _from: _from,
      del_flag: false,
    }
    return await this.query('findMSkillByFrom', {collection: this.collection,  condition    }, 
    {
      _key: true,
      skills:{
        _key: true,
        value: true,
      }
    })
  }

  async findSkills(){
    return await this.query('findUserSkill', {collection: 'm_skill'},{
_key:true
    })
  }

  async saveSkills(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserSkill',
      this.collection,
      [data],
      returnField
    );
  }

  async removeUserSkill(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserSkill',
      this.collection,
      data,
      returnFields
    );
  }
}
