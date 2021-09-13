import { extend } from 'lodash';
import { Injectable } from '@angular/core';
import { AitBaseService } from '@ait/ui';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService extends AitBaseService {
  saveCourse = async (data: any[]) => {
    return await this.mutation('saveCourse', 'user_course', data, { _key: true });
  }
  
  findCourseByKey = async (user_key : string) => {
    const condition = {
      _key: user_key,
      del_flag: false,
    }
    return await this.query('findCourse', {collection: 'user_course',  condition    }, 
    {
      _key : true,
      name:true,
      is_online: true,
      training_center: true,
      course_number: true,
      start_date_from: true,
      start_date_to: true,
      description: true,
      file: true,
    })
  }

  deleteCourseByKey = async (_key: string ) => {
    const returnFields = {_key: true };
    const data = { _key };
    return await this.mutation('removeCourse', 'user_course', [data], returnFields);
  }
}
