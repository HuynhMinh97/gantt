/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { KEYS, RESULT_STATUS, SysSaveTemp, SYSTEM_COMPANY } from '@ait/shared'
import { FormGroup, ValidationErrors } from '@angular/forms';
import { AitAuthService } from '../services/common/ait-auth.service';
import { AitUserService } from '../services/common/ait-user.service';
import { AppState, getLang, getLoading, getSettingLangTime } from '../state/selectors';
import {
  CHANGECOMPANY,
  ChangeLangage,
  GetCaptionByPages,
  GetCommonCaptions, GetCommonMessages, LOADINGAPP, SetModulePage, StoreSetting, StoreUserId, StoreUserInfo
} from '../state/actions';
import { AitEnvironmentService } from '../services';
import { registerLocaleData } from '@angular/common';
import { AitAppUtils } from '../utils/ait-utils';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { map } from 'rxjs/operators';
import localeEnn from '@angular/common/locales/en';
import localeVnn from '@angular/common/locales/vi';
import localeJpp from '@angular/common/locales/ja';
import { AitSaveTempService } from '../services/common/ait-save-temp.service';
import { MODE } from '../@constant';

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
  private isRefreshToken = false;
  public currentPermission = [];

  constructor(
    public store: Store<AppState>,
    public authService: AitAuthService,
    public apollo: Apollo,
    public userService: AitUserService,
    _env: AitEnvironmentService,
    public layoutScrollService?: NbLayoutScrollService,
    public toastrService?: NbToastrService,
    public saveTempService?: AitSaveTempService,
  ) {
    this.user_id = AitAppUtils.getUserId();
    const userId = this.authService.getUserID();
    this.env = _env;
    this.company = this.env?.COMMON?.COMPANY_DEFAULT;
    localStorage.setItem('comp', this.env?.COMMON?.COMPANY_DEFAULT);
    // call api get all message follow by type as I : Information , W : Warning, E: Error
    this.getAllMessages().then();

    //get caption common for buttons, header, label, ...
    this.getCommonCaptions().then();

    //setting default lang & company

    this.store.pipe(select(getLang)).subscribe(lang => {

      if (this.lang !== lang) {
        this.lang = lang;


        //get caption common for buttons, header, label, ...
        this.getCommonCaptions().then();

        // call api get all message follow by type as I : Information , W : Warning, E: Error
        this.getAllMessages().then();

        // call api get user setting
        // this.settingUpUser().then();


        if (localStorage.getItem('access_token')) {
          this.
            getUserSetting(userId).then(r => {

              if (r?.status === RESULT_STATUS.OK) {
                const data = r.data ? r.data[0] : {};

                this.lang = data?.site_language || this.env.COMMON.LANG_DEFAULT
                // Push lang on store base on user-setting
                this.store.dispatch(
                  new ChangeLangage(
                    data?.site_language || this.env.COMMON.LANG_DEFAULT
                  )
                );

                //// console.log(this.lang)

                // //get caption common for buttons, header, label, ...
                // this.getCommonCaptions(this.lang).then();

                // // call api get all message follow by type as I : Information , W : Warning, E: Error
                this.getAllMessages().then();

                // call api get user setting
                this.settingUpUser().then((b) => {
                  const result = {
                    ...data,
                    date_format_display: this.getValueByCodeMaster(data.date_format_display, b || []),
                    date_format_input: this.getValueByCodeMaster(data.date_format_input, b || []),
                    number_format: this.getValueByCodeMaster(data.number_format, b || [])
                  }
                  // // Push settings on store base on user-setting
                  this.store.dispatch(new StoreSetting(result));
                });

              }
            })
        }
      }

    })
    // get token from localStorage
    this.token = this.authService.getAccessToken();

    // call api get all message follow by type as I : Information , W : Warning, E: Error
    this.getAllMessages().then();

    //get caption common for buttons, header, label, ...
    this.getCommonCaptions().then();



    // // CAll get user info , such as company, username, email, _key
    if (localStorage.getItem('access_token')) {
      if (userId && userId !== '') {

        this.getUserInfo(userId).then((res: any) => {
          if (!res || !res?.email) {
            this.authService.removeTokens();

            location.reload();
          }
          else {


            // Push company on store base on user-setting
            this.store.dispatch(
              new CHANGECOMPANY(res?.company || this.env.COMMON.COMPANY_DEFAULT)
            );
            localStorage.setItem('comp', res?.company || this.env.COMMON.COMPANY_DEFAULT);
            this.store.dispatch(new StoreUserInfo(res));
          }

        });

      }
      else {
        this.authService.removeTokens();

        location.reload();
      }
    }

    // Listening event loading when the app is loading
    store
      .pipe(select(getLoading))
      .subscribe((loading) => (this.isLoading = loading));





    // apply user info for base component
    store.subscribe({
      next: state => {
        const { userInfo } = state.commonReducer;
        this.user_id = AitAppUtils.getUserId();
        this.username = userInfo?.username;
        this.userProfile = userInfo?.user_profile;
        this.email = userInfo?.email;
      }
    });

  }

  public initBaseComponent = () => {
    const userId = this.authService.getUserID();
    console.log(userId)
    // CAll get user info , such as company, username, email, _key
    // if (localStorage.getItem('access_token')) {
    //   if (userId && userId !== '') {

    //     this.getUserInfo(userId).then((res: any) => {
    //       if (!res || !res?.email) {
    //         this.authService.removeTokens();

    //         location.reload();
    //       }
    //       else {


    //         // Push company on store base on user-setting
    //         this.store.dispatch(
    //           new CHANGECOMPANY(res?.company || this.env.COMMON.COMPANY_DEFAULT)
    //         );
    //         localStorage.setItem('comp', res?.company || this.env.COMMON.COMPANY_DEFAULT);
    //         this.store.dispatch(new StoreUserInfo(res));
    //       }

    //     });

    //   }
    //   else {
    //     this.authService.removeTokens();

    //     setTimeout(() => {
    //       location.reload();
    //     },300)
    //   }
    // }

    if (localStorage.getItem('refresh_token')) {
      this.refreshToken().then((r: any) => {
        if (r?.data?.refreshToken) {
          const result: any = r?.data?.refreshToken;
          this.authService.saveTokens(result?.token, result?.refreshToken);
        }
      }).catch(e => {
        if (e.message.includes('expired')) {
          this.authService.removeTokens();
          location.reload();
        }
      });
    }



  }
  // api call user-setting from master-data
  private settingUpUser = async () => {
    const data = await this.getUserSettingData('USER_SETTING');
    this.dataUserSetting = data;
    return data;
  }

  // method get name or value by code
  private getValueByCodeMaster = (code: string, data?: any) => {
    const find = (data || this.dataUserSetting).find(f => f.code === code);
    return find?.name;
  }

  refreshToken = async () => {
    const rf = localStorage.getItem('refresh_token');
    return await this.apollo.mutate({
      mutation: gql`
      mutation {
        refreshToken(input : {
          refresh_token : "${rf}"
        }) {
          timeLog
          refreshToken
          token
        }
      }
      `
    }).toPromise();
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
    return rest?.data?.findUserSetting;
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
    //// console.log(this.lang)
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
                  class : {
                    value : ["${classMaster}"]
                  },
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
      user_setting = result.data;
    }

    return user_setting;
  }

  async findUserSettingCode() {
    let user_setting = [];
    const rest: any = await this.apollo.query({
      query: gql`
      query {
        findUserSetting(request: {
          company: "${this.company}"
          lang: "${this.lang}"
          user_id: "${this.user_id}"
          collection: "user_setting"
          condition: {
            user_id: "${this.user_id}"
          }
        }) {
          data {
            date_format_display
          }
        }
      }
    `
    }).toPromise();
    const result = rest?.data.findUserSetting;
    if (result) {
      user_setting = result.data;
    }
    return user_setting[0];
  }

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

    const mes = this.allMessages ? this.allMessages[typeMessage] : [];
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
  getCommonCaptions = async (lang?: string) => {
    const r: any = await this.getCaption('common', 'common');
    const result = r?.data?.findSystem;
    if (result) {
      if (result.status === RESULT_STATUS.OK) {
        this.store.dispatch(new GetCommonCaptions({ page: 'common', module: 'common', data: result.data }))
      }
    }
  }


  // Get Caption common or by page & module
  getCaption = async (pages?: string, module?: string,) => {
    return await this.apollo.query({
      query: gql`
      query {
        findSystem(request : {
          company: "${this.company || this.env?.COMMON?.COMPANY_DEFAULT}",
          lang: "${this.lang || this.env?.COMMON?.LANG_DEFAULT}",
          collection: "sys_caption",
          user_id: "${this.user_id}",
          condition: {
            module : "${module && typeof module === 'string' ? module : 'common'}",
            page : "${pages && typeof pages === 'string' ? pages : 'common'}"
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

    // register locale by language setting
    this.store.pipe(select(getSettingLangTime)).subscribe({
      next: (state) => {
        switch (state?.site_language) {
          case 'en_US':

            return registerLocaleData(localeEnn);
          case 'vi_VN':

            return registerLocaleData(localeVnn);
          default:

            return registerLocaleData(localeJpp);
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
    this.getPermission(page, module).then();
    this.store.dispatch(new SetModulePage({ page, module }));
    this.module = module;
    this.page = page;
    this.getCaption(data.page, data.module).then((r: any) => {
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
    return await new Promise((resolve, reject) => {
      this.apollo.query({
        query: gql`
        query {
          findSystem(request : {
            company: "${this.company}",
            lang: "${this.lang || this.env.COMMON.LANG_DEFAULT}",
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
      }).toPromise().then(r => resolve(r)).catch(e => reject(e))
    })

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

    // //// console.log(gqlQuery);

    return this.apollo
      .query({
        query: gql`
            ${gqlQuery}
          `,
        fetchPolicy: 'network-only',
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

  public async getKey(code: string, type: 'page' | 'module') {
    try {
      const result: any = await this.apollo.query({
        query: gql`query {
          findSystem(request : {
            collection : "sys_${type}",
            company: "d3415d06-601b-42c4-9ede-f5d9ff2bcac3",
              lang: "ja_JP",
            condition: {
              code : {
                value : ["${code}"]
              }
            }
          }) {
            data  {
              _key
            }
          }
        }`
      }).toPromise();
      return result?.data?.findSystem?.data[0]?._key
    } catch (error) {
      return error;
    }
  }

  public checkPermission(permission: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE') {
    return this.currentPermission.includes(permission);
  }

  public async getPermission(page: string, module: string) {
    try {
      const page_key = await this.getKey(page, 'page');
      const module_key = await this.getKey(module, 'module');
      const result: any = await this.apollo.query({
        query: gql`query{
          findPermission(request : {
            page_key : "${page_key}",
            module_key: "${module_key}",
            user_key: "${this.user_id}"
          }) {
            page
            module
            permission
            user_id
          }
        }`
      }).toPromise();

      const p = result.data?.findPermission;
      this.currentPermission = p?.permission;
      return p;
    }
    catch (e) {
      console.log(e)
      return null;
    }
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
              this.getMsg('E0003').replace(
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

  async findTempData(mode: string, _key: string = '') {
    const condition: SysSaveTemp = {
      page: this.page,
      module: this.module,
      user_id: this.user_id,
      mode
    };
    mode === MODE.EDIT && (condition['edit_id'] = _key);
    return await this.saveTempService.find(condition);
  }

  async saveTempData(mode: string, data: string, _key: string = '') {
    const saveData: SysSaveTemp = {
      page: this.page,
      module: this.module,
      mode,
      data,
    };
    mode === MODE.EDIT && (saveData['edit_id'] = _key);
    await this.saveTempService.save([saveData]);
  }

  async removeTempData(_key: string) {
    _key && await this.saveTempService.remove(_key);
  }

  // Destroy the unused supcritions
  ngOnDestroy() {
    this.sup.unsubscribe();
  }
}
