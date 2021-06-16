import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { AppState, getCaption, getLang } from '../../state/selectors';


export class TranslationSet {
  public languange: string;
  public values: any;
}

@Injectable()
export class AitTranslationService {
  masterData: any[];
  currentLang = '';
  captionByPage = [];
  allMessage = [];
  constructor(store?: Store<AppState>) {
    store.pipe(select(getLang)).subscribe(lang => {
      if (this.currentLang !== lang) {
        this.currentLang = lang;
        store.pipe(select(getCaption)).subscribe(req => {
          //module.page${group_no+code} as a key in i18n
          this.captionByPage = req.map(cap => {

            const _key = `${cap.module}.${cap.page}.${cap.code}`
            return {
              _key,
              value: cap.name,
              code: cap.code
            }
          });
        });
        store.subscribe(s => {
          this.allMessage = s.commonReducer.commonMessages;
        })
      }
    });

  }




  deepFind = (obj, path) => {
    // eslint-disable-next-line prefer-const
    let paths = path.split('.')
      , current = obj
      , i;

    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] === undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }

  /**
  * Translate web by lang
  *
  * @param {string} value
  * @returns {string} translated value
  * @memberof TranslationService
  */
  translate(value: string): string {
    const code = value.toLowerCase();
    // console.log(code,this.captionByPage)

    if (this.captionByPage.length !== 0) {
      const find = this.captionByPage.find(caption => {
        return caption.code === code;
      });

      return find?.value || code;
    }
    else {
      const find = this.captionByPage.find(caption => {
        return caption.code === code;
      });

      return find?.value || code;
    }
  }



  getMsg = (code: string) => {
    const typeMessage = code ? code[0] : '';
    const mes = this.allMessage[typeMessage];
    console.log(mes)

    if (mes) {
      const mainCode = code.slice(1, code.length);

      const find = mes.find(m => m.code === mainCode);
      console.log(find)
      return find?.message[this.currentLang] || '';
    }
    return '';
  }

  // Please provide api for search master data for page
}
