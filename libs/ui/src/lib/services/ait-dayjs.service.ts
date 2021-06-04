import { Injectable } from '@angular/core';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import { select, Store } from '@ngrx/store';

import { AppState } from '../state/selectors';
import { getUserSetting } from '../state/selectors';
import { HttpClient } from '@angular/common/http';
import { AitBaseService } from './common/ait-base.service';
import { AitEnvironmentService } from './ait-environment.service';
import { AitAppUtils } from '../utils/ait-utils';



export enum FORMATTIME {
  vi_VN = 'DD/MM/YYYY HH:mm:ss',
  en_US = 'MM/DD/YYYY HH:mm:ss',
  ja_JP = 'YYYY/MM/DD HH:mm:ss',
}

export enum OFFSET {
  vi_VN = 7,
  en_US = 9,
  ja_JP = 9,
}

@Injectable()
export class AitDayJSService extends AitBaseService {
  private offset = 0;
  private lang = 'en_US';
  private dateFormat = 'YYYY/MM/DD' + ' HH:mm:ss';

  constructor(store: Store<AppState>, httpService: HttpClient, envService: AitEnvironmentService,
  ) {
    super(envService, store, httpService);
    store.pipe(select(getUserSetting)).subscribe(setting => {
      dayjs.extend(timezone);
      dayjs.extend(utc);
      const locale = this.getLocale(setting?.site_language || 'ja_JP');
      this.lang = setting?.site_language || 'ja_JP';
      this.offset = setting?.timezone || OFFSET[this.lang];
      this.dateFormat = (setting?.date_format_display?.value.replace('yyyy', 'YYYY').replace('dd', 'DD') || 'YYYY/MM/DD') + ' HH:mm:ss';
      dayjs.locale(locale);// use locale
    });

  }

  private getLocale = (lang) => {
    switch (lang) {
      case 'en_US':
        return 'es';
      case 'ja_JP':
        return 'ja';
      default:
        return 'vi';
    }
  }


  public calculateDateTime = (datetime, excludeFormat?: string) => {
    if (!AitAppUtils.isValidDate(datetime) && typeof datetime !== 'number') {
      return datetime;
    }
    const offset = this.offset;

    const date = new Date(datetime);

    const localTime = date.getTime();


    // get local timezone offset and convert to milliseconds
    const localOffset = date.getTimezoneOffset() * 60000;

    // obtain the UTC time in milliseconds
    const utc = localTime + localOffset;


    const newDateTime = utc + (3600000 * offset);

    const convertedDateTime = new Date(newDateTime);
    return dayjs(convertedDateTime.toLocaleString()).format(this.dateFormat.replace(excludeFormat || '', ''));
  }

}
