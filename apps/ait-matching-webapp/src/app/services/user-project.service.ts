/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserProjectService extends AitBaseService {
  collection = 'user_project';

  async find(_key: string) {
    const condition = {
      _key,
      del_flag: false
    }
    condition['company_working'] = {
      attribute: 'company_working',
      ref_collection: 'm_company',
      ref_attribute: '_key',
      get_by: '_key',
    }
    condition['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
      get_by: '_key',
    }
    condition['project_name'] = {
      attribute: 'project_name',
      ref_collection: 'm_project',
      ref_attribute: '_key',
      get_by: '_key',
    }

    return await this.query(
      'findUserProject',
      {
        collection: 'user_project',
        condition
      },
      {
        _key: true,
        user_id: true,
        company: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
        project_name:  {
          _key: true,
          value: true
        },
        start_date_from: true,
        start_date_to: true,
        company_working: {
          _key: true,
          value: true
        },
        title: {
          _key: true,
          value: true
        },
        description: true,
        responsibility: true,
        achievement: true,
      }
    );
  }

  
  async findSkillsByFrom(_from?: string) {
    const condition = {
      _from: _from,
      del_flag: false,
    }
    return await this.query('findMSkillByFrom', { collection: 'user_project_skill', condition },
      {
        skills: {
          _key: true,
          value: true
        },
      })
  }

  

  async saveBizProject(data: any) {
    const returnField = { user_id: true, _key: true };
    return await this.mutation('saveUserProject', 'user_project', [data], returnField);
  }

  async saveSkills(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveSkill',
      'user_project_skill',
      [data],
      returnField
    );
  }

  async saveConnectionUserProject(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveConnectionUserProject',
      'user_project_edge',
      [data],
      returnField
    );
  }
  // delete user_project_skill
  async removeSkill(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeSkillProject',
      'user_project_skill',
      data,
      returnFields
    );
  }
  // delete user_project_edge
  async removeUserProejct(data: any[]) {
    const returnFields = { _key: true };
    return await this.mutation(
      'removeUserProject',
      'user_project_edge',
      data,
      returnFields
    );
  }
  // delete user_project
  async remove(_key: string) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation('removeProject', this.collection, [{ _key: _key }], returnFields);
  }

  async delete(_key: string, table: string) {
    const returnFields = { _key: true, user_id: true };
    return await this.mutation('removeUserProject', table, [{ _key: _key }], returnFields);
  }

  // user-profile
  async getProjectByUserId(user_id: string) {
    const condition = {
      user_id: user_id,
      del_flag: false
    }
    condition['company_working'] = {
      attribute: 'company_working',
      ref_collection: 'm_company',
      ref_attribute: '_key',
    }
    condition['title'] = {
      attribute: 'title',
      ref_collection: 'm_title',
      ref_attribute: '_key',
    }
    condition['project_name'] = {
      attribute: 'project_name',
      ref_collection: 'm_project',
      ref_attribute: '_key',
    }
    return await this.query(
      'findUserProject',
      {
        collection: 'user_project',
        condition,
        options: { sort_by: { value: 'start_date_to', order_by: 'DESC' } }
      },
      {
        _key: true,
        user_id: true,
        project_name: {
          _key: true,
          value: true,
        },
        start_date_from: true,
        start_date_to: true,
        company_working:{
          _key: true,
          value: true,
        },
        name_title:true,
        title:{
          _key: true,
          value: true,
        },
      }
    );
  }


}
