import { extend } from 'lodash';
import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService extends AitBaseService {
  saveCourse = async (data: any) => {
    return await this.mutation('saveCourse', 'user_course', data, { _key: true });
  }
  
  
  findCourseByKey = async (user_key : string) => {
    const condition = {
      _key: user_key,
      del_flag: false,
    }
    condition['training_center'] = {
      attribute: 'training_center',
      ref_collection: 'm_training_center',
      ref_attribute: '_key'
    };
    condition['name'] = {
      attribute: 'name',
      ref_collection: 'm_course',
      ref_attribute: '_key'
    };
    return await this.query('findCourse', {collection: 'user_course',  condition    }, 
    {
      _key : true,
      name:{
        _key: true,
        value: true,
      },
      is_online: true,
      training_center:{
        _key: true,
        value: true,
      },
      course_number: true,
      start_date_from: true,
      start_date_to: true,
      description: true,
      file: true,
      user_id: true
    })
  }

  deleteCourseByKey = async (_key: string ) => {
    const returnFields = {_key: true };
    const data = { _key };
    return await this.mutation('removeCourse', 'user_course', [data], returnFields);
  }

  //profile
  findCourseByUserId = async (user_id : string) => {
    const condition = {
      user_id: user_id,
      del_flag: false,
    }
    condition['training_center'] = {
      attribute: 'training_center',
      ref_collection: 'm_training_center',
      ref_attribute: '_key'
    };
    condition['name'] = {
      attribute: 'name',
      ref_collection: 'm_course',
      ref_attribute: '_key'
    };
    return await this.query('findCourse', {collection: 'user_course',  condition    }, 
    {
      _key : true,
      name:{
        _key: true,
        value: true,
      },         
      training_center:{
        _key: true,
        value: true,
      },     
      start_date_from: true,
      start_date_to: true,
      user_id: true
    })
  }
}
