import { DatePipe, formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import dayjs from 'dayjs';
import { AppState, getSettingLangTime } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';

@Injectable({ providedIn: 'root' })
export class AitDateFormatService {
  currentLang = 'en_US';
  formatDateTimeInput = '';
  formatDateTimeDisplay = '';
  currentDateInput = null;
  constructor(store: Store<AppState>, private datePipe: DatePipe) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => { }
    store.pipe(select(getSettingLangTime)).subscribe(setting => {
      if (this.currentLang !== setting?.site_language) {
        this.currentLang = setting?.site_language || 'en_US';

      }
      if (this.formatDateTimeDisplay !== setting?.date_format_display) {
        this.formatDateTimeDisplay = setting?.date_format_display;

      }
      if (this.formatDateTimeInput !== setting?.date_format_input) {
        this.formatDateTimeInput = setting?.date_format_input;

      }

    })
  }

  formatDateByVi = (date) => {

    let reusult;
    if (date.includes('-')) {
      const d = date.split('-');
      reusult = new Date(d[2], d[1] - 1, d[0])
    } else {
      const d = date.split('/');

      reusult = new Date(Number(d[2]), d[1] - 1, (Number(d[0])))
    }

    return reusult;
  }

  isRightFormatDate = (date, format: string) => {
    return dayjs(date, format, true).isValid();
  }

  getDateByFormat = (date, format?: string) => {
    let fd = date;
    if (this.currentLang === 'vi_VN') {
      fd = this.formatDateByVi(date);
    }
    const unix = (new Date(fd)).getTime();

    if (isNaN(unix)) {
      return null;
    }
    const d = formatDate(unix, format || (this.formatDateTimeInput || 'MM/dd/yyyy'), this.getCurrentLocale() || 'ja-JP');

    return d;
  }

  getCurrentLocale = () => this.currentLang.replace('_', '-');

  formatDate = (dateInput, format?: string) => {
    try {
      if (AitAppUtils.isValidDate(dateInput) || typeof dateInput === 'number') {

        const b = typeof dateInput !== 'number' ? (new Date(dateInput)).getTime() : dateInput;
        const formatTime = format === 'input' ? this.formatDateTimeInput : this.formatDateTimeDisplay;

        if (formatTime) {

          const d = this.datePipe.transform(b, formatTime, this.getCurrentLocale());
          const dateFormat = d;

          return dateFormat;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  formatDatePicker = (dateInput, format?: string) => {
    try {
      if (AitAppUtils.isValidDate(dateInput) || typeof dateInput === 'number') {

        const b = typeof dateInput !== 'number' ? (new Date(dateInput)).getTime() : dateInput;
        const formatTime = format ? format : this.formatDateTimeInput;
        if (formatTime) {

          const d = this.datePipe.transform(b, formatTime, this.getCurrentLocale());
          const dateFormat = d;
          return dateFormat;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

}
