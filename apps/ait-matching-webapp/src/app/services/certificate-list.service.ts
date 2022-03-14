import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CertificateListService extends AitBaseService {
  collection = 'user_certificate_award';
  async find(condition = {}) {
    condition['del_flag'] = false;

    if (!condition['name']){
      condition['name'] = {}
    }
    condition['name']['attribute'] = 'certificate_name';
    condition['name']['ref_collection'] = 'm_certificate_award';
    condition['name']['ref_attribute'] = 'code';

    if (!condition['issue_by']){
      condition['issue_by'] = {}
    }
    condition['issue_by']['attribute'] = 'issue_by';
    condition['issue_by']['ref_collection'] = 'm_training_center';
    condition['issue_by']['ref_attribute'] = 'code';

    if (!condition['create_by']) {
      condition['create_by'] = {};
    }

    if (!condition['change_by']) {
      condition['change_by'] = {};
    }
    condition['create_by']['type'] = 'matching';
    condition['change_by']['type'] = 'matching';

    return await this.query(
      'GetCertificateList',
      {
        collection: this.collection,
        condition,
        options: { sort_by: { value: 'first_name', order_by: 'DESC' } },
      },
      {
        _key: true,
        grade: true,
        last_name: true,
        first_name: true,
        certificate_award_number: true,
        create_at: true,
        create_by: true,
        change_at: true,
        change_by: true,
        description: true,
        issue_date_from: true,
        name:  true,
        issue_by: {
          _key: true,
          value: true
        },
      }
    );
  }
  
}
