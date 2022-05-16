import { Action } from '@ngrx/store';
import { KeywordSearch } from '../models';
import { AitActionTypes } from '../types';

export class StoreKeywordsSearch implements Action {
  readonly type = AitActionTypes.store_keywords_search;
  public payload: KeywordSearch;
  constructor(_payload: KeywordSearch) {
    this.payload = _payload;
  }
}

export class LOADINGAPP implements Action {
  readonly type = AitActionTypes.loading_app;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}
