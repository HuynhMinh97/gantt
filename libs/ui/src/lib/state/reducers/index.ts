import { CURRENCY_SYMBOL } from '../../@constant';
import { Caption, UserInfo } from '../selectors';
import { ActionTypes } from '../types';
export const LIST_SKILL_HISTORY = 'skill_history';
interface CommonState {
  company?: string;
  language?: string;
  userInfo?: UserInfo;
  captions?: Caption;
  commonCaptions?: Caption;
  isAppLoading?: boolean;
  requestInfo?: {
    module: string;
    page: string;
  };
  user_setting?: any;
  app_loading?: boolean;
  show_snackbar?: any;
  currencySymbol?: string;
  isRememberMe?: boolean;
  pageInfo?: any;
  commonMessages?: any;
  env?: any;
}
interface CommonAction {
  type: string;
  payload: CommonState | any;
}


const langStorage = localStorage.lang;

export const initialState: CommonState = {
  company: '',
  language: langStorage || 'ja_JP',
  userInfo: {
    user_id: '',
    email: '',
    user_profile: {
      country_region: {},
      date_of_birth: '',
      district: {},
      first_name: '',
      floor_building: {},
      gender: {},
      industry: {},
      introduce: '',
      katakana: '',
      last_name: '',
      phone_number: '',
      postcode: {},
      province_city: {},
      romaji: '',
      street: {},
      title: { value: '' },
      user_id: '',
      ward: {},
      company_working: {},
      position: '',
      department: '',
    },
    username: '',
  },
  commonCaptions: {
    module: '',
    page: '',
    data: [
    ],
  },
  captions: {
    module: '',
    page: '',
    data: [
    ],
  },
  isAppLoading: false,
  requestInfo: {
    page: '',
    module: '',
  },
  user_setting: {},
  app_loading: false,
  show_snackbar: {},
  currencySymbol: 'JPY',
  isRememberMe: false,
  pageInfo: {},
  commonMessages: {},
  env: {}
};

export const applyCurrencySymbolByLocale = (lang: string) => {
  switch (lang) {
    case 'vi_VN':
      return CURRENCY_SYMBOL.vi;
    case 'en_US':
      return CURRENCY_SYMBOL.en;
    default:
      return CURRENCY_SYMBOL.ja;
  }
}

export const CommonReducer = (state = initialState, action: CommonAction): CommonState => {
  switch (action.type) {
    // CODING case for getting state here 😎👌👌\
    case ActionTypes.get_environment:
      return {
        ...state,
        env: action.payload
      }
    case ActionTypes.get_common_message:
      return {
        ...state,
        commonMessages: action.payload
      }
    case ActionTypes.get_common_caption:
      return {
        ...state,
        commonCaptions: action.payload
      }
    case ActionTypes.get_caption_by_pages:
      return {
        ...state,
        captions: action.payload
      }
    case ActionTypes.remmember_me:
      return {
        ...state,
        isRememberMe: action.payload
      }
    case ActionTypes.Get_currency_symbol:
      return {
        ...state,
        currencySymbol: action.payload
      }
    case ActionTypes.Loading_app:
      return {
        ...state,
        app_loading: action.payload,
      };
    case ActionTypes.Change_company_app:
      return {
        ...state,
        company: action.payload,
      };
    case ActionTypes.Store_user_setting:
      return {
        ...state,
        user_setting: action.payload,
      };
    case ActionTypes.Store_user_id:
      return {
        ...state,
        userInfo: { ...state.userInfo, user_id: action.payload },
      };
    case ActionTypes.Set_module_page:

      return {
        ...state,
        requestInfo: action.payload,
      };
    case ActionTypes.Change_lang_app:
      localStorage.setItem('lang', action.payload);
      return {
        ...state,
        language: action.payload,
        currencySymbol: applyCurrencySymbolByLocale(action.payload)
      };
    case ActionTypes.Store_user_info:
      return {
        ...state,
        userInfo: action.payload,
      };
    case ActionTypes.Store_user_profile:
      return {
        ...state,
        userInfo: { ...state.userInfo, user_profile: action.payload },
      };
    default:
      return state;
  }
};



