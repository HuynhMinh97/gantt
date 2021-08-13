import * as shared from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService extends AitBaseService {
  private getInfoUrl = environment.API_PATH.BIZ.JOB + '/get-job-info';
  private saveJobUrl = environment.API_PATH.BIZ.JOB + '/save-job-company';
  private deleteJobUrl = environment.API_PATH.BIZ.JOB + '/delete-job-company';

  async getJobInfo(job_company: string | string[]) {
    return await this.post(this.getInfoUrl, {
      condition: {
        job_company
      }
    }).toPromise();
  }

  async deleteJobInfo(_key: string) {
    return await this.post(this.deleteJobUrl, {
      condition: {
        _key
      }
    }).toPromise();
  }

  async getJobByKey(job_key: string) {
    return await this.post(this.getInfoUrl, {
      condition: {
        _key: job_key
      }
    }).toPromise();
  }

  // async saveCompanyJob(data: shared.JobInfoDto[]) {
  //   return await this.post(this.saveJobUrl, { data }).toPromise();
  // }

}
