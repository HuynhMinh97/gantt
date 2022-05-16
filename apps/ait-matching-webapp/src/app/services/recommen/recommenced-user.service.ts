import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CompanyInfo } from '../../pages/interface';


@Injectable({ providedIn: 'root' })
export class RecommencedUserService extends AitBaseService {
  // private baseUrlEx = 'http://localhost:3000/api/v1';
  private url = environment.API_PATH.AIT.RECOMMENCED_USER.MATCHING_COMPANY;
  private urldetail = environment.API_PATH.AIT.RECOMMENCED_USER.GET_DETAIL_MATCHING;
  private profileCompUrl = environment.API_PATH.AIT.RECOMMENCED_USER.GET_COMPANY_PROFILE;
  private getTabSaveUrl = environment.API_PATH.AIT.RECOMMENCED_USER.GET_TAB_SAVE;
  private saveCompanyInfo = environment.API_PATH.COMPANY.SAVE;
  private searchCompanyUrl = environment.API_PATH.AIT.RECOMMENCED_USER.SEARCH_COMPANY;

  async getDataTabSave(company_key: string) {
    return await this.post(this.getTabSaveUrl, { data: [{ list_keys: [company_key] }] }).toPromise();
  }

  async searchCompany(keyword: string) {
    return await this.post(this.searchCompanyUrl, { condition: { keyword } }).toPromise();
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
