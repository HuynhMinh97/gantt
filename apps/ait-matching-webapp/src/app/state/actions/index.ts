import { Action } from "@ngrx/store";
import { KeywordSearch } from "../models";
import { AureoleActionTypes } from "../types";

export class StoreKeywordsSearch implements Action {
  readonly type = AureoleActionTypes.store_keywords_search;
  public payload: KeywordSearch;
  constructor(_payload: KeywordSearch) {
    this.payload = _payload;
  }
}
