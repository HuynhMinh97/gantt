import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSkillsService extends AitBaseService{
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

  async saveSkills(data: any) {
    console.log(data); 
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
