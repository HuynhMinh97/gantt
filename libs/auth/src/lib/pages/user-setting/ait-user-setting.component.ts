import { AfterViewInit } from '@angular/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GRAPHQL, isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AitUserService,
  AppState,
  ChangeLangage,
  getLang,
  getUserSetting,
  StoreSetting,
} from '@ait/ui';
import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MODULES, PAGES } from '../../@constant';
@Component({
  selector: 'ait-user-setting',
  templateUrl: 'ait-user-setting.component.html',
  styleUrls: ['./ait-user-setting.component.scss'],
})
export class AitUserSettingComponent
  extends AitBaseComponent
  implements OnInit, AfterViewInit {
  @Input() skillList: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() wdith: string;
  messageArlet = 'common.menu-user.user-setting.alert';
  currentLang = '';
  data: any;
  storeSetting: any;
  loadingSetting = false;
  isInit = false;
  dataLangs = [];
  dataTimeZone = [];
  langList = ['vi_VN', 'ja_JP', 'en_US'];
  langDf: any;
  timeDf: any;
  dateInputDf: any;
  dateDisplayDf: any;
  numberFormatDf: any;
  dataObject = {
    dataLanguage: [],
    dataTimezone: [],
    dataDateFormatDisplay: [],
    dataDateFormatInput: [],
    dataNumberFormat: [],
  };
  settingObj: { site_language?: string; timezone?: string } = {};

  formState:
    | {
        site_language?: string;
        timezone?: string;
        date_format_input?: string;
        date_format_display?: string;
        number_format?: string;
      }
    | any = {};

  valueState:
    | {
        site_language?: string;
        timezone?: string;
        date_format_input?: string;
        date_format_display?: string;
        number_format?: string;
      }
    | any = {};

  langLabel = '1002';
  timeLabel = '1003';
  displayLabel = '1004';
  inputLabel = '1005';
  numberLabel = '1006';
  title = '';

  errors = {
    lang: [],
    timezone: [],
    input: [],
    display: [],
    number: [],
  };
  defaultInputValues: any = {};

  setDefaultInputValues = (newState: any) =>
    (this.defaultInputValues = newState
      ? { ...this.defaultInputValues, ...newState }
      : this.defaultInputValues);

  setLabel = (label: string) => this.translatePipe.translate(label);

  setErrors = (newState: any) => {
    this.errors = { ...this.errors, ...newState };
  };

  getErrorMessageAll = (value: string, label: string, fieldName: string) => {
    const listErrors = [this.checkRequired(value, label)];
    this.setErrors({
      [fieldName]: listErrors,
    });
  };

  setDataObject = (newState: {
    dataLanguage?: any[];
    dataTimezone?: any[];
    dataDateFormatDisplay?: any[];
    dataDateFormatInput?: any[];
    dataNumberFormat?: any[];
  }) => {
    this.dataObject = { ...this.dataObject, ...newState };
  };

  constructor(
    public masterData: AitMasterDataService,
    store: Store<AppState>,
    toastrService: NbToastrService,
    authService: AitAuthService,
    private translatePipe: AitTranslationService,
    public userService: AitUserService,
    envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      envService,
      null,
      toastrService
    );
    this.setModulePage({
      page: PAGES.USER_SETTING,
      module: MODULES.USER,
    });

    store.pipe(select(getLang)).subscribe(() => {
      const title = this.translatePipe.translate('c_10020');
      if (title !== 'c_10020') {
        this.title = title;
      }
    });

    store.pipe(select(getUserSetting)).subscribe((set) => {
      if (!AitAppUtils.isObjectEqual(set, this.settingObj)) {
        this.settingObj = set;
        const target: any = set || {};
        masterData
          .find({
            class: {
              value: ['LANGUAGE'],
            },
          })
          .then((r) => {
            if (r?.status === RESULT_STATUS.OK) {
              const data = r.data.map((f) => ({
                ...f,
                value: f?.name,
                _key: f?.code,
              }));
              this.setDataObject({
                dataLanguage: data,
              });
              this.dataLangs = this.dataObject.dataLanguage;

              this.langDf = this.getLangDefault(target?.site_language);
            }
          });
        masterData
          .find({
            class: {
              value: ['TIMEZONE'],
            },
          })
          .then((r) => {
            if (r?.status === RESULT_STATUS.OK) {
              const data = r.data.map((f) => ({
                ...f,
                value: f?.name,
                _key: f?.code,
              }));

              this.setDataObject({
                dataTimezone: data,
              });
              this.dataTimeZone = this.dataObject.dataTimezone;
              this.timeDf = this.getTimezoneDefault(target?.timezone);
            }
          });
        this.storeSetting = target;
      }
    });

    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnInit() {
    this.getSetting();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getErrorsMessage();
      this.isInit = true;
    }, 2000);
  }

  getErrorsMessage() {
    this.getErrorMessageAll(undefined, this.getTitle(this.langLabel), 'lang');
    this.getErrorMessageAll(
      undefined,
      this.getTitle(this.timeLabel),
      'timezone'
    );
    this.getErrorMessageAll(undefined, this.getTitle(this.inputLabel), 'input');
    this.getErrorMessageAll(
      undefined,
      this.getTitle(this.displayLabel),
      'display'
    );
    this.getErrorMessageAll(
      undefined,
      this.getTitle(this.numberLabel),
      'number'
    );
  }

  async getSetting() {
    this.callLoadingApp();
    try {
      const res = await this.userService.getUserSetting(this.user_id);
      if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
        const target = res.data[0];
        this.setupUserSetting(target);
      } else {
        this.setupUserSetting(this.storeSetting);
      }
    } catch {
      this.cancelLoadingApp();
    }
  }

  setupUserSetting = (target: any) => {
    try {
      this.queryUserSetting('USER_SETTING').then((r) => {
        const data = r.map((f) => ({ ...f, value: f?.name, _key: f?.code }));
        this.setDataObject({
          dataDateFormatDisplay: data.filter(
            (d) => d.parent_code === 'DATE_FORMAT_DISPLAY'
          ),
          dataDateFormatInput: data.filter(
            (d) => d.parent_code === 'DATE_FORMAT_INPUT'
          ),
          dataNumberFormat: data.filter(
            (d) => d.parent_code === 'NUMBER_FORMAT'
          ),
        });

        if (target?.date_format_display) {
          this.dateDisplayDf = Object.assign({
            code: target?.date_format_display?.code,
            _key: target?.date_format_display?.code,
            value: target?.date_format_display?.value,
            name: target?.date_format_display?.value,
            parent_code: 'DATE_FORMAT_DISPLAY',
          });
        }
        if (target?.date_format_input) {
          this.dateInputDf = Object.assign({
            code: target?.date_format_input?.code,
            _key: target?.date_format_input?.code,
            value: target?.date_format_input?.value,
            name: target?.date_format_input?.value,
            parent_code: 'DATE_FORMAT_INPUT',
          });
        }
        if (target?.number_format) {
          this.numberFormatDf = Object.assign({
            code: target?.number_format?.code,
            _key: target?.number_format?.code,
            value: target?.number_format?.value,
            name: target?.number_format?.value,
            parent_code: 'NUMBER_FORMAT',
          });
        }
        this.setDefaultInputValues({
          dateDisplayDf: this.dateDisplayDf,
          dateInputDf: this.dateInputDf,
          numberFormatDf: this.numberFormatDf,
        });

        const df = this.getDataDefault();
        this.setFormState(df);

        this.cancelLoadingApp();
      });
    } catch {
      this.cancelLoadingApp();
    }
  };

  getTitle = (name: string) => {
    return this.translatePipe.translate(name);
  };

  clearDefaultValueInput = () => {
    this.langDf = null;
    this.timeDf = null;
    this.dateInputDf = null;
    this.dateDisplayDf = null;
    this.numberFormatDf = null;
  };

  resetForm = () => {
    this.clearDefaultValueInput();
    setTimeout(() => {
      this.langDf = this.defaultInputValues?.langDf;
      this.timeDf = this.defaultInputValues?.timeDf;
      this.dateDisplayDf = this.defaultInputValues?.dateDisplayDf;
      this.dateInputDf = this.defaultInputValues?.dateInputDf;
      this.numberFormatDf = this.defaultInputValues?.numberFormatDf;
    }, 50);
  };

  queryUserSetting = async (classMaster: string) => {
    const returnFields = {
      code: true,
      _key: true,
      name: true,
      parent_code: true,
    };
    const condition = {
      active_flag: true,
      class: {
        value: [classMaster],
      },
    };
    const request = {};
    request['collection'] = 'sys_master_data';
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    const rest = await this.query(GRAPHQL.FIND_SYSTEM, request, returnFields);

    let dataMaster = [];
    const result = rest?.data;
    if (result) {
      dataMaster = result;
    }
    return dataMaster || [];
  };

  back = () => {
    history.back();
  };

  getDataDefault = (): any => {
    return {
      site_language: this.langDf?.code,
      timezone: this.timeDf?.code,
      date_format_display: this.dateDisplayDf?.code,
      date_format_input: this.dateInputDf?.code,
      number_format: this.numberFormatDf?.code,
    };
  };

  setFormState = (newState: {
    site_language?: string;
    timezone?: string;
    date_format_input?: string;
    date_format_display?: string;
    number_format?: string;
  }) => {
    this.formState = { ...this.formState, ...newState };
  };

  setValueState = (newState: {
    site_language?: string;
    timezone?: string;
    date_format_input?: string;
    date_format_display?: string;
    number_format?: string;
  }) => {
    this.valueState = { ...this.valueState, ...newState };
  };

  setUserSetting = () => {
    this.getUserSetting(this.user_id).then((r) => {
      if (r?.data[0]?.site_language) {
        this.store.dispatch(
          new ChangeLangage(r.data[0].site_language || 'ja_JP')
        );
      }
      const result = {};
      Object.entries(r?.data[0]).forEach(([key, target]) => {
        if (target) {
          if (key === 'site_language' || key === 'timezone') {
            result[key] = target['code'];
          } else {
            result[key] = target;
          }
        }
      });
      this.store.dispatch(new StoreSetting(result));
    });
  };

  getFieldNotNullFromState = () => {
    const objectDifference = AitAppUtils.difference(
      this.formState,
      this.getDataDefault()
    );

    Object.keys(objectDifference).forEach((key) => {
      if (!objectDifference[key]) {
        delete objectDifference[key];
      }
    });
    const arrayFieldsNotNull = Object.keys(objectDifference);

    return arrayFieldsNotNull.filter((x) => !!x);
  };

  handleInput = (val, field: string, label: string) => {
    // this.getErrorMessageAll(val?.value, label, field);
  };

  checkBeforeSaving = () => {
    const {
      site_language,
      timezone,
      date_format_display,
      number_format,
    } = this.formState;
    this.getErrorMessageAll(
      site_language,
      this.getTitle(this.langLabel),
      'lang'
    );
    this.getErrorMessageAll(
      timezone,
      this.getTitle(this.timeLabel),
      'timezone'
    );
    this.getErrorMessageAll(
      this.formState.date_format_input,
      this.getTitle(this.inputLabel),
      'input'
    );
    this.getErrorMessageAll(
      date_format_display,
      this.getTitle(this.displayLabel),
      'display'
    );
    this.getErrorMessageAll(
      number_format,
      this.getTitle(this.numberLabel),
      'number'
    );
  };

  isErrors = () => {
    let isError = false;
    for (const prop in this.formState) {
      if (!this.formState[prop]) {
        isError = true;
        break;
      }
    }

    return isError;
  };

  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  save = () => {
    const fields = this.getFieldNotNullFromState().map((m) => ({
      [m]: this.formState[m],
    }));
    const { site_language } = this.formState;
    if (!this.isErrors()) {
      if (fields.length !== 0) {
        this.userService
          .saveUserSetting([
            { ...this.formState, user_id: this.user_id, _key: this.user_id },
          ])
          .then((r) => {
            if (r.status === RESULT_STATUS.OK) {
              // this.store.dispatch(new StoreSetting(r.data[0]));

              const newSetting = { ...this.valueState, user_id: this.user_id };
              this.store.dispatch(new StoreSetting(newSetting));
              if (site_language) {
                this.store.dispatch(new ChangeLangage(site_language));
                localStorage.setItem('lang', site_language);
              }
              setTimeout(() => {
                const mapping = {
                  site_language: this.getTitle(this.langLabel),
                  timezone: this.getTitle(this.timeLabel),
                  date_format_display: this.getTitle(this.displayLabel),
                  date_format_input: this.getTitle(this.inputLabel),
                  number_format: this.getTitle(this.numberLabel),
                };
                const fieldsTrans = this.getFieldNotNullFromState().map((m) =>
                  this.jsUcfirst(mapping[m])
                );
                const title = this.translatePipe.translate('c_10020');
                const successToSave = this.translatePipe.getMsg('I0012');
                this.loadingSetting = false;
                this.showToastr(
                  title,
                  `${fieldsTrans.join(', ')} ` + successToSave
                );
                this.back();
              }, 100);
            }
            this.loadingSetting = false;
          });
      } else {
        const nothingToSave = this.getMsg('W0001');
        this.showToastr(this.title, nothingToSave, 'warning');
        this.loadingSetting = false;
      }
    }
  };

  getLangDefault = (lang) => {
    if (!lang) {
      return null;
    }
    const findLang = this.dataLangs.find((f) => f.code === lang);
    return findLang;
  };

  getTimezoneDefault = (timezone) => {
    if (!timezone) {
      return null;
    }
    const findTimezone = this.dataTimeZone.find((f) => f.code === timezone);
    return findTimezone;
  };

  getValueLang = (val) => {
    this.setFormState({
      site_language: val?.value[0]?._key,
    });
    this.setValueState({
      site_language: val?.value[0]?._key,
    });
  };

  getValueDateInf = (val) => {
    this.setFormState({
      date_format_input: val?.value[0]?._key,
    });
    this.setValueState({
      date_format_input: val?.value[0]?.value,
    });
  };

  getValueDateDisplay = (val) => {
    this.setFormState({
      date_format_display: val?.value[0]?._key,
    });
    this.setValueState({
      date_format_display: val?.value[0]?.value,
    });
  };

  getValueNumberFormat = (val) => {
    this.setFormState({
      number_format: val?.value[0]?._key,
    });
    this.setValueState({
      number_format: val?.value[0]?.value,
    });
  };

  getValueTimeZone = (val) => {
    this.setFormState({
      timezone: val?.value[0]?._key || null,
    });
    this.setValueState({
      timezone: val?.value[0]?._key || null,
    });
  };

  getNameLang = (name) => {
    return name[this.currentLang];
  };

  getErrors(type: string, name: string): string[] {
    if (!this.formState[type]) {
      return this.errors[name];
    }
  }
}
