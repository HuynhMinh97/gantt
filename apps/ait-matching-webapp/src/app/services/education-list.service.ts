import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EducationListService extends AitBaseService {
  collection = 'user_education';
  async find(condition = {}) {
    condition['del_flag'] = false;

    if (!condition['school']){
      condition['school'] = {}
    }
    condition['school']['attribute'] = 'school';
    condition['school']['ref_collection'] = 'm_school';
    condition['school']['ref_attribute'] = 'code';

    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'getListEducation',
      {
        collection: this.collection,
        condition,
      },
      {
        _key: true,
        grade: true,
        last_name: true,
        first_name: true,
        degree: true,
        field_of_study: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
        description: true,
        start_date_from: true,
        school:{
          _key: true,
          value: true,
        }
      }
    );
  }
 
}
