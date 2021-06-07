/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { KEYS, RESULT_STATUS, SYSTEM_COMPANY } from '@ait/shared'
import { FormGroup, ValidationErrors } from '@angular/forms';
import { AitAuthService } from '../services/common/ait-auth.service';
import { AitUserService } from '../services/common/ait-user.service';
import { AppState, getLoading, getSettingLangTime } from '../state/selectors';
import {
  ChangeLangage,
  GetCaptionByPages,
  GetCommonCaptions, GetCommonMessages, LOADINGAPP, SetModulePage, StoreSetting, StoreUserId, StoreUserInfo
} from '../state/actions';
import { AitEnvironmentService } from '../services';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeVn from '@angular/common/locales/vi';
import localeJp from '@angular/common/locales/ja';
import { AitAppUtils } from '../utils/ait-utils';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { map } from 'rxjs/operators';


export interface BaseInitData {
  module: string;
  page: string;
}

@Component({
  selector: 'ait-base-component',
  template: ``
})
export class AitBaseComponent implements OnInit, OnDestroy {
  public module: string;
  public lang = 'ja_JP';
  public page: string;
  public sup = new Subscription();
  public title = 'PM';
  public company = '';
  public user_id = '';
  public username = '';
  public userProfile: any;
  public email = '';
  public token = '';
  public pageInfo = null;
  public allMessages;
  public isLoading = false;
  public env: any;
  public dataUserSetting = [];

  constructor(
    public store: Store<AppState>,
    public authService: AitAuthService,
    public apollo: Apollo,
    public userService: AitUserService,
    _env: AitEnvironmentService,
    private layoutScrollService?: NbLayoutScrollService,
    public toastrService?: NbToastrService,
  ) {
    this.env = _env;
    //setting default lang & company
    const langStorage = localStorage.lang;
    this.company = this.env.COMMON.COMPANY_DEFAULT;
    // get token from localStorage
    this.token = authService.getAccessToken();

    //get caption common for buttons, header, label, ...
    this.getCommonCaptions().then();

    // call api get all message follow by type as I : Information , W : Warning, E: Error
    this.getAllMessages().then();

    // call api get user setting
    this.settingUpUser().then();

    // If we couldn't find lang in localStorage, It should be set base on ENV
    if (!langStorage) {
      localStorage.setItem('lang', this.env?.COMMON?.LANG_DEFAULT || 'ja_JP');
    }

    // Push lang  on store
    store.dispatch(new ChangeLangage(langStorage || this.env?.COMMON?.LANG_DEFAULT || 'ja_JP'))

    // Listening event loading when the app is loading
    store
      .pipe(select(getLoading))
      .subscribe((loading) => (this.isLoading = loading));

    // CAll get user info , such as company, username, email, _key
    if (localStorage.getItem('access_token')) {
      const userId = this.authService.getUserID();

      if (userId && userId !== '') {
        this.getUserInfo(userId).then((res: any) => {
          store.dispatch(new StoreUserInfo(res));
          this.
            getUserSetting(userId).then(r => {

              if (r?.status === RESULT_STATUS.OK) {
                const data = r.data ? r.data[0] : {};
                this.lang = data.site_language
                // Push lang on store base on user-setting
                this.store.dispatch(
                  new ChangeLangage(
                    data.site_language || this.env.COMMON.LANG_DEFAULT
                  )
                );
                // Push company on store base on user-setting
                this.company = data.company;
                this.store.dispatch(
                  new StoreSetting({
                    site_language:
                      data.company ||
                      this.env.COMMON.LANG_DEFAULT,
                  })
                );
                const result = {
                  ...data,
                  date_format_display: this.getValueByCodeMaster(data.date_format_display),
                  date_format_input: this.getValueByCodeMaster(data.date_format_input),
                  number_format: this.getValueByCodeMaster(data.number_format)
                }
                // // Push settings on store base on user-setting
                this.store.dispatch(new StoreSetting(result));
              }
            })


        });
      }
    }

    // apply company and lang for base component
    // store.pipe(select(getLang_Company)).subscribe(data => {
    //   this.lang = data.language || this.env?.COMMON?.LANG_DEFAULT;
    //   this.company = data.company || this.env?.COMMON?.COMPANY_DEFAULT;
    // });

    // apply user info for base component
    store.subscribe({
      next: state => {
        const { userInfo } = state.commonReducer;
        this.user_id = AitAppUtils.getUserId();
        this.username = userInfo?.username;
        this.userProfile = userInfo?.user_profile;
        this.email = userInfo?.email;
      }
    })
  }

  // api call user-setting from master-data
  private settingUpUser = async () => {
    this.getUserSettingData('USER_SETTING').then(data => {
      this.dataUserSetting = data;
    })
  }

  // method get name or value by code
  private getValueByCodeMaster = (code: string) => {
    const find = this.dataUserSetting.find(f => f.code === code);
    return find?.name;
  }



  // api call to get user info
  getUserInfo = async (user_id: string) => {
    if (user_id && user_id !== '') {
      let user = {};
      const rest_user: any = await this.apollo.query({
        query: gql`
        query {
          findByConditionUser(request:{
                company: "${this.company}",
                lang: "${this.lang}",
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
      const result = rest_user?.data?.findByConditionUser;

      if (result) {
        user = result[0]
      }

      return user;
    }
    return {};
  }
  // api call to get user setting
  getUserSetting = async (userId: string) => {
    const rest: any = await this.apollo.query({
      query: gql`
      query {
        findUserSetting (
          request: {
            collection: "user_setting",
          condition: {
            user_id: "${userId}"
          },
          company: "${this.company}",
          lang: "${this.lang}", user_id: "${userId}"}) {
            data {
                  _key
                  company
                  date_format_input
                  date_format_display
                  number_format
                  site_language
                  timezone
            }
            message
            errors
            status
        }
    }
      `
    }).toPromise();
    return rest.data.findSystem;
  }



  setUserId = (id) => {
    this.user_id = id;
    this.store.dispatch(new StoreUserId(id));
  }

  get LANG(): string {
    return this.lang || this.env.COMMON.LANG_DEFAULT;
  }

  get COMPANY(): string {
    return this.company || this.env.COMMON.COMPANY_DEFAULT;
  }

  async getUserSettingData(classMaster: string) {
    let user_setting = [];
    const rest_user: any = await this.apollo.query({
      query: gql`
        query {
          findSystem(request:{
                company: "${this.company}",
                lang: "${this.lang}",
                collection: "sys_master_data",
                user_id: "${this.user_id}",
                condition: {
                  class : "${classMaster}",
                  active_flag: true
                }
          }){
            data {
              _key
              code
              name
            }
            message
            errors
            status
          }
        }
        `
    }).toPromise();
    const result = rest_user?.data?.findSystem;

    if (result) {
      user_setting = result.data
    }

    return user_setting;
  }

  getUserSettingBackup = (company) => {
    this.userService.getUserSetting(company).then((r) => {
      if (r?.data[0]?.site_language) {
        this.store.dispatch(new ChangeLangage(r.data[0].site_language?.code));
        this.store.dispatch(
          new StoreSetting({ site_language: r.data[0].site_language?.code })
        );
        this.userService.getUserSetting(company).then((res) => {
          const result = {};
          Object.entries(res?.data[0] || {}).forEach(([key, target]) => {
            if (target) {
              if (key === 'site_language' || key === 'timezone') {
                result[key] = target['code'];
              } else {
                result[key] = {
                  code: target['code'],
                  value: target['value'],
                };
              }
            }
          });

          this.store.dispatch(new StoreSetting(result));
        });
      }
    });
  };


  private replaceValueInMess = (message: string, params: any[]) => {
    const result = message;
    params.forEach((p, index) => {
      result.replace(`${index}`, p)
    });
    return result;
  }

  goBack = () => {
    history.back();
  }


  getMsg = (code: string) => {
    const typeMessage = code ? code[0] : '';
    const mes = this.allMessages[typeMessage];
    if (mes) {
      const mainCode = code.slice(1, code.length);
      const find = mes.find(m => m.code === mainCode);
      return find?.message[this.lang] || code;
    }
    return code;
  }

  checkMess = () => {
    const message = this.getMsg('E0001');
    return message;
  }

  checkDif = (string1: string, string2: string) => {
    const message = this.getMsg('E0105');

    return string1 === string2 ? message : null;
  }

  checkEqual2pwd = (val: any, val2: any) => {
    const message = this.getMsg('E0101');
    return val === val2 ? null : message;
  }

  checkRequired = (value: any, fieldName: string) => {
    const message = this.getMsg('E0001').replace('{0}', fieldName);
    return value ? null : message;
  }
  checkLen = (value: any) => {
    const regex = /^\d+$/;
    const isValue = regex.test(value);
    if (!isValue) {
      const message = this.getMsg('E0002');
      return message;
    }
  }
  checkMaxLength = (value: string, maxLength: number) => {
    const message = this.getMsg('E0006').replace('{0}', maxLength.toString());
    if (value === null || !value) {
      return null;
    }
    return value.length > maxLength ? message : null;
  }

  checkMinLength = (value: string, minLength: number, fieldName: string) => {
    const target = value || '';
    if (value.length === 0) {
      return null;
    }
    const message = this.getMsg('E0010').replace('{0}', fieldName).replace('{1}', minLength.toString());
    if (target === null) {
      return null;
    }

    return value.length < minLength && value.length !== 0 ? message : null;
  }

  checkBetween = (value: any, range: number[]) => {
    const message = this.getMsg('E0005');
    if (value === null || !value) {
      return null;
    }
    return value >= range[0] && value <= range[1] ?
      null :
      message
        .replace('{0}', range[0].toString())
        .replace('{1}', range[1].toString());
  }

  checkLessThan = (target: number, number: number) => {
    if (target === null || !target) {
      return null;
    }
    if (typeof target === 'string' || typeof number === 'string') {
      const message = this.getMsg('E0002');
      return message;
    }
    const message = this.getMsg('E0003');
    return target < number ?
      null :
      message
        .replace('{0}', number.toString())
  }

  checkGreaterThan = (target: number, number: number) => {

    if (target === null || !target) {
      return null;
    }
    if (typeof target === 'string' && typeof number === 'string') {
      const message = this.getMsg('E0002');
      return message;
    }
    const message = this.getMsg('E0004');
    return target > number ? message.replace('{0}', number.toString()) : null
  }

  checkLessOrEqual = (target: number, number: number) => {
    if (target === null || !target) {
      return null;
    }
    if (typeof target === 'string' || typeof number === 'string') {
      const message = this.getMsg('E0002');
      return message;
    }
    const message = this.getMsg('E0003');
    return target <= number ? null : message.replace('{0}', number.toString());
  }

  checkGreaterOrEqual = (target: number, number: number) => {
    if (target === null || !target) {
      return null;
    }
    if (typeof target === 'string' || typeof number === 'string') {
      const message = this.getMsg('E0002');
      return message;
    }
    const message = this.getMsg('E0004');
    return target <= number ? null : message.replace('{0}', target.toString()).replace('{1}', number.toString());
  }

  gotoTop = () => {

    this.layoutScrollService.scrollTo(0, 0)
  }

  callLoadingApp = () => {
    this.store.dispatch(new LOADINGAPP(true));
  }

  cancelLoadingApp = () => {

    this.store.dispatch(new LOADINGAPP(false));
  }
  getCommonCaptions = async () => {

    this.getCaption().then((r: any) => {
      const result = r?.data?.findSystem;
      if (result) {
        if (result.status === RESULT_STATUS.OK) {
          this.store.dispatch(new GetCommonCaptions({ page: 'common', module: 'common', data: result.data }))
        }
      }
    })

  }


  // Get Caption common or by page & module
  getCaption = async (page?: string, module?: string) => {

    return await this.apollo.query({
      query: gql`
      query {
        findSystem(request : {
          company: "${this.company}",
          lang: "${this.lang}",
          collection: "sys_caption",
          user_id: "${this.user_id}",
          condition: {
            module : "${module ? module : 'common'}",
            page : "${page ? page : 'common'}"
          }
        }) {
          data {
            _key
            code
            name
            module
            page
          }
          errors
          message
          status
          numData
          numError
        }
      }
      `
    }).toPromise();
  }


  // Start basecomponent for initializing
  ngOnInit() {
    AitAppUtils.checkTokens();
    this.getCommonCaptions().then()
    this.getAllMessages().then();

    // register locale by language setting
    this.store.pipe(select(getSettingLangTime)).subscribe({
      next: (state) => {
        switch (state?.site_language) {
          case 'en_US':
            return registerLocaleData(localeEn);
          case 'vi_VN':
            return registerLocaleData(localeVn);
          default:
            return registerLocaleData(localeJp);
        }
      },
    });
  }

  // convert date to unix_time
  dateToUnixtime = (date: string) => {
    const result = new Date(date).getTime();
    return result;
  }

  // conver unix_time to date
  unixtimeToDate = (unix_time: number) => {
    const result = (new Date(unix_time)).toDateString();
    return result;
  }

  // set module and page for each screen and get caption base on theme
  setModulePage = (data: BaseInitData) => {
    const { module, page } = data;
    this.store.dispatch(new SetModulePage({ page, module }));
    this.module = module;
    this.page = page;

    this.getCaption(page, module).then((r: any) => {
      const result = r?.data?.findSystem;
      if (result) {
        if (result.status === RESULT_STATUS.OK) {
          this.store.dispatch(new GetCaptionByPages({ page: data.page, module: data.module, data: result.data }))
        }
      }
    })
    // Coding here for calling api to request caption or master data for module and page 🚀🚀🚀
  }

  // Get all message and store theme on store for requesting to components
  getAllMessages = async () => {
    const res: any = await this.getSysMessage();
    const result = res?.data?.findSystem;
    if (result) {
      if (result?.status === RESULT_STATUS.OK) {
        this.allMessages = {
          I: result?.data.filter(f => f?.type === 'I'),
          E: result?.data.filter(f => f?.type === 'E'),
          W: result?.data.filter(f => f?.type === 'W'),
        };

        this.store.dispatch(new GetCommonMessages(this.allMessages));
      }

    }
  }

  // api get sys message
  getSysMessage = async () => {
    return await this.apollo.query({
      query: gql`
      query {
        findSystem(request : {
          company: "${this.company}",
          lang: "${this.lang}",
          collection: "sys_message",
          user_id: "${this.user_id}",
          condition: {

          }
        }) {
          data {
            _key
            code
            message {
              ${this.lang}
            }
            type
          }
          errors
          message
          status
          numData
          numError
        }
      }
      `
    }).toPromise();

  }

  /**
  * Fetch data from database
  * @param name name of query in graphql
  * @param returnField object return to client
  * @param condition condition search
  * @returns data or error
  */
  query(name: string, request: any, returnField?: any) {
    // Request to graphql query
    request['company'] = this.company || SYSTEM_COMPANY;
    request['lang'] = this.lang;
    request['user_id'] = this.user_id;

    // Setup gql json
    const query = {
      query: {
        [name]: {
          data: returnField,
          message: true,
          errors: true,
          status: true,
          numData: true,
          numError: true
        }
      }
    };

    query.query[name]['__args'] = { request };
    // Parse to gql
    const gqlQuery = jsonToGraphQLQuery(query, { pretty: true });

    // console.log(gqlQuery);

    return this.apollo
      .query({
        query: gql`
            ${gqlQuery}
          `,
      })
      .pipe(map((res) => (<any>res.data)[name]))
      .toPromise();
  }
  // get page info
  getPageInfo = async (page: string) => {
    const returnField = {
      _key: true,
      name: true,
      module: true,
      code: true,

      slug: true,
      param: true
    };
    const conditions = {
      active_flag: true,
      code: page,
    }
    const result = await this.query('findByConditionPage', returnField, conditions);
    this.pageInfo = (result as []).find((f: any) => f.code === this.page);
    return this.pageInfo;
    // this.store.dispatch(new GetPageInfo({ data: result }))
  }

  // show toast will be fire when the components call it
  showToastr(title: string = '', message: string = '',
    status: 'info' | 'warning' | 'primary' | 'danger' | 'basic' | 'success' = KEYS.SUCCESS,
  ) {
    this.toastrService.show(title, message, {
      status,
      position: NbGlobalLogicalPosition.BOTTOM_END,
      preventDuplicates: true,
    });
  }

  // get message erros when form invalid
  getFormErrorMessage = (form: FormGroup, label?: any) => {
    const mess = {};
    Object.keys(form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach((error) => {
          mess[key] = [];
          if (error === 'required') {
            mess[key].push(this.getMsg('E0001').replace('{0}', label[key]));
          }
          if (error === 'maxlength') {
            mess[key].push(
              this.getMsg('E0002').replace(
                '{0}',
                label[key]
              ).replace('{1}', controlErrors[error]?.requiredLength)
            );
          }
          if (error === 'max') {
            mess[key].push(
              this.getMsg('E0007').replace(
                '{0}',
                label[key]
              ).replace('{1}', '0')
                .replace('{2}', controlErrors[error]?.max)
            );
          }
          if (error === 'email') {
            mess[key].push(this.getMsg('E0014').replace('{0}', label[key]));
          }
        });
      }
    });

    return mess as any;
  };
  // Destroy the unused supcritions
  ngOnDestroy() {
    this.sup.unsubscribe();
  }
}
