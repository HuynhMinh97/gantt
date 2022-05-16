import { AitAppState } from '../models';
import { AitActionTypes } from '../types';

const initialState: AitAppState = {
  keywordsSearch: {}
}

interface CommonAction {
  type: string;
  payload: AitAppState | any;
}


export const AitCommonReducer = (state = initialState, action: CommonAction): AitAppState => {
  switch (action.type) {
    case AitActionTypes.store_keywords_search:
      return {
        ...state,
        keywordsSearch: action.payload,
      };
    default:
      return state;
  }

}
