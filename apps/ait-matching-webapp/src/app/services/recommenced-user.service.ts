import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { CompanyInfo } from '../pages/aureole-v/interface';

@Injectable({ providedIn: 'root' })
export class RecommencedUserService extends AitBaseService {
  // private baseUrlEx = 'http://localhost:3000/api/v1';
  private url = '/aureole-v/matching-company';
  private urldetail = '/aureole-v/get-detail';
  private profileCompUrl = '/aureole-v/get-company-profile';
  private getTabSaveUrl = '/aureole-v/get-tab-save';
  private saveCompanyInfo = '/company/save';

  async getDataTabSave(company_key: string) {
    return await this.post(this.getTabSaveUrl, { data: [{ list_keys: [company_key] }] }).toPromise();
  }

  async matchingCompany(company_key: string, input_user?: string[]) {
    return await this.post(this.url, { condition: { company_key, input_users: input_user || [] } }).toPromise();
  }

  async getDetailMatching(company_key: string, list_ids: string[]) {
    return await this.post(this.urldetail, { condition: { company_key, list_ids } }).toPromise();
  }

  async getCompanyProfile(company_key: string | string[]) {
    return await this.post(this.profileCompUrl, { condition: { _key: company_key } }).toPromise();
  }

  async getCompanyProfileByName(name: string) {
    return await this.post(this.profileCompUrl, { condition: { name: name } }).toPromise();
  }

  async saveCompanyProfile(condition: { user_id: string }, data: [CompanyInfo]) {
    return await this.post(this.saveCompanyInfo, { condition, data }).toPromise();
  }

}
