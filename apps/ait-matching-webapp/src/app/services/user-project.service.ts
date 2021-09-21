/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserProjectService extends AitBaseService {
    collection = 'biz_project';
    
    async find(_key: string) {
      const condition = {
        _key: _key,
        del_flag: false
      }
        condition['skills'] = {
          attribute: 'skills',
          ref_collection: 'm_skill',
          ref_attribute: '_key',
          get_by: '_key',
        }

        return await this.query(
            'findUserProject',
            {
                collection: 'biz_project',
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
                name: true,
                start_date_from: true,
                start_date_to: true,
                company_working: true,
                title: true,
                description: true,
                responsibility: true,
                achievement: true,
                skills:{
                  _key: true,
                  value: true
                },
            }
        );
    }

    async findKeyCompany(_key?: string){
      const condition = {
        company: _key
      }
      const returnFields = {code: true};
      const request = {};
      request['collection'] = 'sys_company';
      request['condition'] = condition;    
      return await this.query('findKey', {collection: 'sys_company',  condition    }, 
      {
        _key : true,
      })
    }

  // tim key title luu trong biz_project
  async findKeyTitle(_key?: string, user_id?:string ){
      const condition = {
          company: _key,
          del_flag: false,
          user_id: user_id
        }
        return await this.query('findKey', {collection: 'user_profile',  condition    }, 
        {
          _key : true,
          title:true,
          company_working: true,
        })
    }

    async findFromBizProjectSkill(_from?: string){
      const condition = {
          _from: _from,
          del_flag: false,
        }
        return await this.query('findKey', {collection: 'biz_project_skill',  condition    }, 
        {
          _to: true
        })
    }

    async findMSkillsByCode(code: string){
      const condition = {
        code: code,
        del_flag: false,
      }
      return await this.query('findKey', {collection: 'm_skill',  condition },{_key: true})
    }

    async save(data: any, table: string) {
        const returnField = { user_id: true, _key: true};
        return await this.mutation('saveUserProject',table,[data],returnField);
    }

    async saveSkills(data: any) {
      console.log(data);
      
      const returnField = { _key: true };
      return await this.mutation(
        'saveSkill',
        'biz_project_skill',
        [data],
        returnField
      );
    }

    async saveConnectionUserProject(data: any) {
      console.log(data);
      
      const returnField = { _key: true };
      return await this.mutation(
        'saveConnectionUserProject',
        'connection_user_project',
        [data],
        returnField
      );
    }

    async removeSkill(data: any[]) {
      const returnFields = { _key: true };
      return await this.mutation(
        'removeSkill',
        'biz_project_skill',
        data,
        returnFields
      );
    }

    async removeUserProejct(data: any[]) {
      const returnFields = { _key: true };
      return await this.mutation(
        'removeUserProject',
        'biz_project_skill',
        data,
        returnFields
      );
    }

    async remove(_key: string) {
        const returnFields = { _key: true, user_id: true };
        return await this.mutation('removeProject', this.collection, [{ _key: _key }], returnFields);
    }

    async delete(_key:string, table: string){
        const returnFields = { _key: true, user_id: true };
        return await this.mutation('removeUserProject', table, [{ _key: _key }], returnFields);
    }
      //tim key cua 1 bang dua vao from va to
      async findKey(_id?: string,_to?: string, table?: string){
        const condition = {
            _from: _id,
            del_flag: false,
          }
          return await this.query('findKey', {collection: table,  condition    }, 
          {
            _key : true,
            _from: true,
            _to: true
          })
      }

      //tim key cua 1 bang dua vao from va to
      async findKeyConnectionUserProject(from: string, to?: string){
        const condition = {
            _from: from,
            _to: to,
            del_flag: false,
          }
          return await this.query('findKey', {collection: 'connection_user_project',  condition    }, 
          {
            _key : true,
            _from: true,
            _to: true
          })
      }

}
