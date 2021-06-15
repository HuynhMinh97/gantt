/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AitBaseService } from './ait-base.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { KeyValueDto } from '@ait/shared';
import { AitEnvironmentService } from '../ait-environment.service';
import gql from 'graphql-tag';
import { AppState } from '../../state/selectors';

export interface UserSetting {
  user_id?: string;
  timezone?: string;
  site_language?: string;
}

@Injectable({
  providedIn: 'root',
})

export class AitUserService extends AitBaseService {
  //Share service in user component
  public userBasicInfo = new AitUserInfo;
  public userTrainingInfo = new AitUserInfo;
  public backUpBasicInfo = new AitUserInfo;
  public backUpTrainingInfo = new AitUserInfo;
  onFocus = false;

  private getURL = '/auth/find-user';
  private getSetting = this.env?.API_PATH?.SYS?.USER + '/get-setting';
  private saveSetting = this.env?.API_PATH?.SYS?.USER + '/save-setting';
  private storeManagement: Store<AppState>;
  private userJobSetting = this.env?.API_PATH?.SYS?.USER + '/get-job-setting';
  private userCertificate = this.env?.API_PATH?.SYS?.USER + '/get-certificate';
  private saveInfo = this.env?.API_PATH?.SYS?.USER_PROFILE + '/save';
  private removeInfo = this.env?.API_PATH?.SYS?.USER_PROFILE + '/remove';
  private removeCertificate = this.env?.API_PATH?.SYS?.USER + '/remove-certificate-info';
  private saveCertificateInfo = this.env?.API_PATH?.SYS?.USER + '/save-user-certificate';
  private createUser = this.env?.API_PATH?.SYS?.USER + '/new_sys_user';
  constructor(
    store: Store<AppState>,
    httpService: HttpClient,
    snackbarService: NbToastrService,
    envService: AitEnvironmentService,
  ) {
    super(envService, store, httpService, snackbarService);
    this.storeManagement = store;
  }
  async getUserSetting(user_id?: string) {
    return await this.post(this.getSetting, { condition: { user_id: user_id || this.user_id } }).toPromise();
  }
  async saveUserSetting(data: UserSetting[]) {

    const dataSave = data.map(d => ({ ...d, user_id: this.user_id }));
    return await this.post(this.saveSetting, { data: dataSave }).toPromise();
  }

  async getUserJobSetting(user_id?: string) {
    return await this.post(this.userJobSetting, { condition: { user_id: user_id || this.user_id } }).toPromise();
  }

  async getUserCertificate(user_id?: string) {
    return await this.post(this.userCertificate, { condition: { user_id: user_id || this.user_id } }).toPromise();
  }

  getUserProfile = (user_id?: string): Promise<any> => {
    return this.post('/user-profile/get', { condition: { user_id: user_id || this.user_id } }).toPromise();
  }

  async saveAitUserInfo(condition: any, data: [AitUserInfo]) {
    return await this.post(this.saveInfo, { condition, data }).toPromise();
  }

  async createSysUser() {
    return await this.post(this.createUser, {}).toPromise();
  }

  async removeUserProfile(condition: any) {
    return await this.post(this.removeInfo, { condition }).toPromise();
  }

  async removeCertificateInfo(condition: any) {
    return await this.post(this.removeCertificate, { condition }).toPromise();
  }

  async saveUserCertificate(condition: any, data: [UserCertificate]) {
    return await this.post(this.saveCertificateInfo, { condition, data }).toPromise();
  }

  getAitUserInfo = async (user_id: string) => {
    if (user_id && user_id !== '') {

      const user = await this.post(this.getURL, { condition: { user_id } }).toPromise();
      const user_profile = await this.post('/user-profile/get', { condition: { user_id } }).toPromise();
      const result = {
        ...user?.data[0],
        user_profile: user_profile?.data ? user_profile?.data[0] : {},
      };
      return result;
    }
    return {};
  }

  getUserInfo = async (user_id: string) => {
    console.log(user_id)
    if (user_id && user_id !== '') {
      let user = null;
      const rest_user: any = await this.apollo.query({
        query: gql`
        query {
          findByConditionUser(request:{
            company: "${this.company}",
                lang: "${this.currentLang}",
                collection: "sys_user",
                user_id: "${user_id}",
                condition: {
                  _key : "${user_id}"
                }
          }){
            email
            username
            _key
            company
          }
        }
        `
      }).toPromise();
      const result = rest_user.findByConditionUser;
      if (result) {
        user = result[0]
      }

      return user;
    }
    return {};
  }

  getFormInfo() {
    return this.userBasicInfo;
  }

  getFormTraining() {
    return this.userTrainingInfo;
  }

  getUserBasicBackUp() {
    return this.backUpBasicInfo;
  }

  getUserTrainingBackUp() {
    return this.backUpTrainingInfo;
  }

  setFormBasicInfo(data: AitUserInfo) {
    this.userBasicInfo = { ...this.userBasicInfo, ...data };
  }

  setFormTrainingInfo(data: AitUserInfo) {
    this.userTrainingInfo = { ...this.userTrainingInfo, ...data };
  }

  setUserBasicBackUp(data: AitUserInfo) {
    this.backUpBasicInfo = data;
  }

  setUserTrainingBackUp(data: AitUserInfo) {
    this.backUpTrainingInfo = data;
  }

  resetData() {
    this.userBasicInfo = new AitUserInfo();
    this.userTrainingInfo = new AitUserInfo();
    this.backUpBasicInfo = new AitUserInfo();
    this.backUpTrainingInfo = new AitUserInfo();
  }
}

export class AitUserInfo {
  //Basic Info
  // no: number;
  name: string;
  name_kana: string;
  avatar: string;
  gender: KeyValueDto;
  dob: number;
  dob_jp: string;
  country: KeyValueDto;
  passport_number: string;
  residence_status: KeyValueDto;
  //Training Info
  accepting_company: string;
  address: string;
  occupation: KeyValueDto;
  immigration_date: number;
  employment_start_date: number;
  no2_permit_date: number;
  stay_period: string;
  no3_exam_dept_date: number;
  no3_exam_dept_pass: KeyValueDto;
  no3_exam_practice_date: number;
  no3_exam_practice_pass: KeyValueDto;
  no3_permit_date: number;
  resume: string;
  current_salary: number;
  training_remark: string;
  agreement: string[];
  certificate_no1: string;
  japanese_skill: KeyValueDto;
  japanese_skill_certificate: string;
  qualification: string;
  qualification_certificate: string;
  is_matching: boolean;
}

export class UserCertificate {
  residence_status: KeyValueDto[];
  salary_type: KeyValueDto;
  salary_desired: number;
  business: KeyValueDto[];
  desired_occupation: KeyValueDto;
  prefecture: KeyValueDto[];
  immigration_date: number;
  remark: string;
  certificate_no1: string;
  japanese_skill: KeyValueDto;
  japanese_skill_certificate: string;
  qualification: string;
  qualification_certificate: string;
}
