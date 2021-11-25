/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';

import numeral from 'numeral';
import { AppState } from '../../state/selectors';
import { getSettingLangTime } from '../../state/selectors';

@Pipe({
  name: 'aitNumberFormat',
  pure: false,
})
export class AitNumberFormatPipe implements PipeTransform {
  locale = 'en-US';
  formatNumber = '';
  constructor(private store: Store<AppState>) {
    store.pipe(select(getSettingLangTime)).subscribe((setting) => {
      if (this.locale !== setting?.site_language) {
        this.locale = this.convertIntlSymbol(setting?.site_language || 'ja-JP');
      }
      if (this.formatNumber !== setting?.number_format?.value) {
        this.formatNumber = setting?.number_format?.value || '###,###,###';
      }
    });
  }

  transform(value: any, staticFormat?: any): any {
    if (staticFormat) {
      return numeral(value).format(staticFormat);
    }
    return !this.formatNumber
      ? new Intl.NumberFormat(this.locale || 'ja-JP').format(value) || null
      : numeral(value).format(this.formatNumber);
  }

  private convertIntlSymbol = (lang: string) =>
    lang ? lang.replace('_', '-') : '';
}
