import { getCurrencySymbol } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CURRENCY_SYMBOL } from '../@constant';
import { AppState } from '../state/selectors';
import { applyCurrencySymbolByLocale } from '../state/reducers';
import { getLang } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class AitCurrencySymbolService {
  symbol = 'JPY';
  lang = 'ja_JP'
  constructor(
    private store: Store<AppState>,
    @Inject(LOCALE_ID) public locale: string) {
    store.pipe(select(getLang)).subscribe(lang => {
      if (this.lang !== lang) {
        this.lang = lang;
        this.symbol = applyCurrencySymbolByLocale(this.lang)
      }
    });
  }
  getCurrencyByLocale = () => {
    if (this.lang !== 'ja_JP') {
      const symbol = getCurrencySymbol(this.symbol, 'wide', this.locale);
    return symbol;
    }
    return '円'

  }

  applyCurrencySymbolByLocale = (lang: string) => {
    switch (lang) {
      case 'vi_VN':
        return CURRENCY_SYMBOL.vi;
      case 'en_US':
        return CURRENCY_SYMBOL.en;
      default:
        return CURRENCY_SYMBOL.ja;
    }
  }

}
