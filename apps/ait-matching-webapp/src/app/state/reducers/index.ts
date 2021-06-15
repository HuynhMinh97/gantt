import { AureoleAppState } from "../models";
import { AureoleActionTypes } from "../types";

const initialState: AureoleAppState = {
  keywordsSearch: {}
}

interface CommonAction {
  type: string;
  payload: AureoleAppState | any;
}


export const AureoleCommonReducer = (state = initialState, action: CommonAction): AureoleAppState => {
  switch (action.type) {
    case AureoleActionTypes.store_keywords_search:
      return {
        ...state,
        keywordsSearch: action.payload,
      };
    default:
      return state;
  }

}
