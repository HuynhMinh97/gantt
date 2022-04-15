import { Action } from '@ngrx/store';
import { KeywordSearch } from '../models';
import { AureoleActionTypes } from '../types';

export class StoreKeywordsSearch implements Action {
  readonly type = AureoleActionTypes.store_keywords_search;
  public payload: KeywordSearch;
  constructor(_payload: KeywordSearch) {
    this.payload = _payload;
  }
}
export class CHANGEOBJECTWEBDB implements Action {
  readonly type = AureoleActionTypes.get_object_id_webdb;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class RELOADCONFIGAPI implements Action {
  readonly type = AureoleActionTypes.isReloadApiConfig;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;

  }
}

export class CHANGERELOADDATAFLAG implements Action {
  readonly type = AureoleActionTypes.change_reload_data_flag;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GETRELOADDATAFLAG implements Action {
  readonly type = AureoleActionTypes.get_data_reload_flag;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class LOADINGAPP implements Action {
  readonly type = AureoleActionTypes.loading_app;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}
