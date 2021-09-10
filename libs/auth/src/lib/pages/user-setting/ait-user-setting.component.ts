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
  StoreSetting
} from '@ait/ui';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MODULES, PAGES } from '../../@constant';
@Component({
  selector: 'ait-user-setting',
  templateUrl: 'ait-user-setting.component.html',
  styleUrls: ['./ait-user-setting.component.scss']
})

export class AitUserSettingComponent extends AitBaseComponent implements OnInit {
  @Input() skillList: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() wdith: string;
  messageArlet = 'common.menu-user.user-setting.alert';
  currentLang = '';
  data: any;
  loadingSetting = false;
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
  settingObj: { site_language?: string, timezone?: string } = {};

  formState: {
    site_language?: string,
    timezone?: string,
    date_format_input?: string,
    date_format_display?: string,
    number_format?: string
  } | any = {};

  valueState: {
    site_language?: string,
    timezone?: string,
    date_format_input?: string,
    date_format_display?: string,
    number_format?: string
  } | any = {};

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
    number: []
  }
  defaultInputValues: any = {};

  setDefaultInputValues = (newState: any) =>
    this.defaultInputValues = newState ? { ...this.defaultInputValues, ...newState } : this.defaultInputValues

  setLabel = (label: string) => this.translatePipe.translate(label);

  setErrors = (newState: any) => {
    this.errors = { ...this.errors, ...newState }
  }

  clearErrors = () => {
    this.setErrors({
      lang: [],
      time: [],
      input: [],
      display: [],
      number: []
    })
  }

  getErrorMessageAll = (value: string, label: string, fieldName: string) => {
    const listErrors = [
      this.checkRequired(value, label)
    ]
    this.setErrors({
      [fieldName]: listErrors
    })
  }

  setDataObject = (newState:
    {
      dataLanguage?: any[],
      dataTimezone?: any[],
      dataDateFormatDisplay?: any[],
      dataDateFormatInput?: any[],
      dataNumberFormat?: any[],
    }) => {
    this.dataObject = { ...this.dataObject, ...newState };
  }

  constructor(
    public masterData: AitMasterDataService,
    store: Store<AppState>,
    toastrService: NbToastrService,
    authService: AitAuthService,
    private translatePipe: AitTranslationService,
    private router: Router,
    public userService: AitUserService,
    envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, userService, envService, null, toastrService);
    this.setModulePage({
      page: PAGES.USER_SETTING,
      module: MODULES.USER
    })


    store.pipe(select(getLang)).subscribe(() => {
      const title = this.translatePipe.translate(
        'c_10020'
      );
      if (title !== 'c_10020') {
        this.title = title;
      }
    })
    store.pipe(select(getUserSetting)).subscribe(set => {

      if (!AitAppUtils.isObjectEqual(set, this.settingObj)) {
        this.settingObj = set;
        const target: any = set || {};
        masterData.find({
          class: {
            value: ['LANGUAGE']
          }
        }).then(r => {

          if (r?.status === RESULT_STATUS.OK) {
            const data = r.data.map(f => ({ ...f, value: f?.name, _key: f?.code }))
            this.setDataObject({
              dataLanguage: data,
            });
            this.dataLangs = this.dataObject.dataLanguage;

            this.langDf = this.getLangDefault(target?.site_language);
          }
        })
        masterData.find({
          class: {
            value: ['TIMEZONE']
          }
        }).then(r => {
          if (r?.status === RESULT_STATUS.OK) {
            const data = r.data.map(f => ({ ...f, value: f?.name, _key: f?.code }))

            this.setDataObject({
              dataTimezone: data,
            });
            this.dataTimeZone = this.dataObject.dataTimezone;
            this.timeDf = this.getTimezoneDefault(target?.timezone);
          }
        })
        this.setupUserSetting(target);
      }
    });

    store.pipe(select(getLang)).subscribe(lang => {
      this.currentLang = lang;


    });
  }


  setupUserSetting = (target: any) => {
    console.log(target)
    this.queryUserSetting('USER_SETTING').then(r => {

      const data = r.map(f => ({ ...f, value: f?.name, _key: f?.code }));
      this.setDataObject({
        dataDateFormatDisplay: data.filter(d => d.parent_code === 'DATE_FORMAT_DISPLAY'),
        dataDateFormatInput: data.filter(d => d.parent_code === 'DATE_FORMAT_INPUT'),
        dataNumberFormat: data.filter(d => d.parent_code === 'NUMBER_FORMAT'),
      });

      if (target?.date_format_display) {
        this.dateDisplayDf = this.dataObject.dataDateFormatDisplay.find(f => f.name === target?.date_format_display);
      }
      if (target?.date_format_input) {
        this.dateInputDf = this.dataObject.dataDateFormatInput.find(f => f.name === target?.date_format_input);
      }
      if (target?.number_format) {
        this.numberFormatDf = this.dataObject.dataNumberFormat.find(f => f.name === target?.number_format);
      }
      this.setDefaultInputValues({
        dateDisplayDf: this.dateDisplayDf,
        dateInputDf: this.dateInputDf,
        numberFormatDf: this.numberFormatDf
      })
      // console.log(this.defaultInputValues);
    })
  }

  getTitle = (name: string) => {
    return this.translatePipe.translate(name);
  }

  clearDefaultValueInput = () => {
    this.langDf = null;
    this.timeDf = null;
    this.dateInputDf = null;
    this.dateDisplayDf = null;
    this.numberFormatDf = null;
  }

  resetForm = () => {
    this.clearDefaultValueInput();
    setTimeout(() => {
      this.langDf = this.defaultInputValues?.langDf;
      this.timeDf = this.defaultInputValues?.timeDf;
      this.dateDisplayDf = this.defaultInputValues?.dateDisplayDf;
      this.dateInputDf = this.defaultInputValues?.dateInputDf;
      this.numberFormatDf = this.defaultInputValues?.numberFormatDf;
    }, 50)
  }

  queryUserSetting = async (classMaster: string) => {
    const returnFields = {
      code: true,
      _key: true,
      name: true,
      parent_code: true
    }
    const condition = {
      active_flag: true,
      class: {
        value: [classMaster]
      }
    }
    const request = {};
    request['collection'] = 'sys_master_data';
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    const rest = await this.query(GRAPHQL.FIND_SYSTEM, request, returnFields);

    let dataMaster = [];
    const result = rest?.data
    if (result) {
      dataMaster = result;
    }
    return dataMaster || [];
  }

  back = () => {
    history.back();
  }

  getDataDefault = (): any => {
    return {
      site_language: this.langDf?.code,
      timezone: this.timeDf?.code,
      date_format_display: this.dateDisplayDf?.code,
      date_format_input: this.dateInputDf?.code,
      number_format: this.numberFormatDf?.code
    }
  }

  setFormState = (newState:
    {
      site_language?: string,
      timezone?: string,
      date_format_input?: string,
      date_format_display?: string,
      number_format?: string,
    }) => {
    this.formState = { ...this.formState, ...newState };
  }

  setValueState = (newState:
    {
      site_language?: string,
      timezone?: string,
      date_format_input?: string,
      date_format_display?: string,
      number_format?: string,
    }) => {
    this.valueState = { ...this.valueState, ...newState };
  }

  setUserSetting = () => {
    this.getUserSetting(this.user_id).then(r => {
      // console.log(r)
      if (r?.data[0]?.site_language) {
        this.store.dispatch(new ChangeLangage(r.data[0].site_language || 'ja_JP'));
      }
      const result = {};
      Object.entries(r?.data[0]).forEach(([key, target]) => {
        if (target) {
          if (key === 'site_language' || key === 'timezone') {
            result[key] = target['code'];
          }
          else {
            result[key] = target;
          }

        }
      });
      this.store.dispatch(new StoreSetting(result));
    });
  }

  getFieldNotNullFromState = () => {
    const objectDifference = AitAppUtils.difference(this.formState, this.getDataDefault());

    Object.keys(objectDifference).forEach(key => {
      if (!objectDifference[key]) {
        delete objectDifference[key]
      }
    })
    const arrayFieldsNotNull = Object.keys(objectDifference);

    return arrayFieldsNotNull.filter(x => !!x);
  }

  handleInput = (val, field: string, label: string) => {
    this.getErrorMessageAll(val?.value, label, field);
  }

  checkBeforeSaving = () => {
    const { site_language, timezone, date_format_display, number_format } = this.formState;
    this.getErrorMessageAll(site_language, this.getTitle(this.langLabel), 'lang');
    this.getErrorMessageAll(timezone, this.getTitle(this.timeLabel), 'timezone');
    this.getErrorMessageAll(this.formState.date_format_input, this.getTitle(this.inputLabel), 'input');
    this.getErrorMessageAll(date_format_display, this.getTitle(this.displayLabel), 'display');
    this.getErrorMessageAll(number_format, this.getTitle(this.numberLabel), 'number');
  }

  isErrors = () => {
    let checks = [];
    Object.entries(this.formState).forEach(([key, value]) => {
      if (!value) {
        const x: any = value;
        checks = [...checks, x];
      }
    });
    return checks.length !== 0
  }

  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  save = () => {
    this.loadingSetting = true;
    this.clearErrors();
    const fields = this.getFieldNotNullFromState().map(m => ({ [m]: this.formState[m] }));
    this.checkBeforeSaving();
    const { site_language } = this.formState;
    if (!this.isErrors()) {
      if (fields.length !== 0) {
        this.userService.saveUserSetting([{ ...this.formState, user_id: this.user_id, _key: this.user_id }]).then(r => {
          if (r.status === RESULT_STATUS.OK) {

            // this.store.dispatch(new StoreSetting(r.data[0]));

            const newSetting = { ...this.valueState, user_id: this.user_id };
            this.store.dispatch(new StoreSetting(newSetting));
            if (site_language) {
              this.store.dispatch(new ChangeLangage(site_language));
              localStorage.setItem('lang', site_language)
            }
            setTimeout(() => {
              const mapping = {
                site_language: this.getTitle(this.langLabel),
                timezone: this.getTitle(this.timeLabel),
                date_format_display: this.getTitle(this.displayLabel),
                date_format_input: this.getTitle(this.inputLabel),
                number_format: this.getTitle(this.numberLabel)
              }
              const fieldsTrans = this.getFieldNotNullFromState().map(m => this.jsUcfirst(mapping[m]));
              const title = this.translatePipe.translate(
                'c_10020'
              );
              const successToSave = this.translatePipe.getMsg('I0012');
              this.loadingSetting = false;
              this.showToastr(title, `${fieldsTrans.join(', ')} ` + successToSave);
              this.back();
            }, 100);
          }
          this.loadingSetting = false;
        });
      }
      else {

        const nothingToSave = this.getMsg('W0001');
        this.showToastr(this.title, nothingToSave, 'warning');
        this.loadingSetting = false;
      }
    }
  }

  getLangDefault = (lang) => {
    if (!lang) {
      return null;
    }
    const findLang = this.dataLangs.find(f => f.code === lang);
    return findLang;
  }

  getTimezoneDefault = (timezone) => {
    if (!timezone) {
      return null;
    }
    const findTimezone = this.dataTimeZone.find(f => f.code === timezone);
    return findTimezone;
  }

  getValueLang = (val) => {
    // console.log(val)
    if (val.length === 0) {
      this.getErrorMessageAll('', this.langLabel, 'lang')
    }
    this.setFormState({
      site_language: val?.value[0]?._key,
    });
    this.setValueState({
      site_language: val?.value[0]?._key,
    });
  }

  getValueDateInf = (val) => {
    if (val.length === 0) {
      this.getErrorMessageAll('', this.inputLabel, 'input')
    }
    this.setFormState({
      date_format_input: val?.value[0]?._key,
    });
    this.setValueState({
      date_format_input: val?.value[0]?.value,
    });
  }

  getValueDateDisplay = (val) => {
    if (val.length === 0) {
      this.getErrorMessageAll('', this.displayLabel, 'display')
    }
    this.setFormState({
      date_format_display: val?.value[0]?._key,
    });
    this.setValueState({
      date_format_display: val?.value[0]?.value,
    });
  }

  getValueNumberFormat = (val) => {
    if (val.length === 0) {
      this.getErrorMessageAll('', this.numberLabel, 'number')
    }
    this.setFormState({
      number_format: val?.value[0]?._key,
    });
    this.setValueState({
      number_format: val?.value[0]?.value,
    });
  }

  getValueTimeZone = (val) => {
    if (val.length === 0) {
      this.getErrorMessageAll('', this.timeLabel, 'timezone')
    }
    this.setFormState({
      timezone: val?.value[0]?._key || null,
    });
    this.setValueState({
      timezone: val?.value[0]?._key || null,
    });
  }

  getNameLang = (name) => {
    return name[this.currentLang];
  }
}
