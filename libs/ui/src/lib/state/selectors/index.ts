// USER

// tslint:disable-next-line: variable-name
export const getLang_Company = (state: AppState) => ({
  language: state.commonReducer.language,
  company: state.commonReducer.company,
});

export const getLang = (state: AppState) => {
  return state.commonReducer.language;
};

export const getLoading = (state: AppState) => {
  return state.commonReducer.app_loading;
};

export const getUserSetting = (state: AppState) => {
  return state.commonReducer.user_setting;
};

export const getRememberMe = (state: AppState) => {
  return state.commonReducer.isRemmemberMe;
};

export const getCurrencySymbolByLocale = (state: AppState) => {
  return state.commonReducer.currencySymbol;
};

export const getSettingLangTime = (state: AppState) => {
  return state.commonReducer.user_setting;
};

export const getUFullName = (state: AppState) => {
  const user_profile = state?.commonReducer?.userInfo?.user_profile;
  return user_profile?.name;
};

export const getTitle = (state: AppState) => {
  const { userInfo } = state.commonReducer;
  return userInfo.user_profile.title;
};

export const getUserProfile = (state: AppState) => {
  return state.commonReducer.userInfo?.user_profile;
};

export const getUserInfo = (state: AppState) => {
  return state.commonReducer.userInfo;
};

export const getEmpId = (state: AppState) => {
  const { userInfo } = state.commonReducer;
  return userInfo.user_id;
};

export const getEmail = (state: AppState) => {
  const { userInfo } = state.commonReducer;
  return userInfo?.email;
};

export const getAllInfoRequest = (state: AppState) => {
  const info: CommonReducer = state.commonReducer;
  return {
    lang: info?.language,
    company: info?.userInfo?.company,
    user_id: info?.userInfo?._key,
    module: info?.requestInfo?.module,
    page: info?.requestInfo?.page,
    username: info?.userInfo?.username,
  };
};

export const getCaption = (state: AppState) => {
  return [
    ...state.commonReducer.commonCaptions.data,
    ...state.commonReducer.captions.data,
  ];
};

export const getCommonCaption = (state: AppState) => {
  return state.commonReducer.commonCaptions;
};

export const getEnvironment = (state: AppState) => {
  return state.commonReducer.env;
};

export interface AppState {
  commonReducer: CommonReducer;
  themeReducer: ThemeReducer;
}

export interface CommonReducer {
  company: string;
  language: string;
  userInfo: UserInfo;
  captions: Caption;
  commonCaptions: Caption;
  isAppLoading: boolean;
  requestInfo: {
    module: string;
    page: string;
  };
  user_setting?: any;
  app_loading: boolean;
  show_snackbar: any;
  currencySymbol?: string;
  isRemmemberMe?: boolean;
  pageInfo?: any;
  commonMessages?: any;
  env?: any;
}

export interface ThemeReducer {
  theme: string;
}

export interface UserInfo {
  _key?: string;
  user_id?: string;
  email?: string;
  company?: string;
  type?: number;
  user_profile?: {
    country_region?: any;
    date_of_birth?: string;
    district?: any;
    first_name?: string;
    floor_building?: any;
    gender?: any;
    industry?: any;
    introduce?: string;
    katakana?: string;
    last_name?: string;
    phone_number?: string;
    postcode?: any;
    province_city?: any;
    romaji?: string;
    street?: any;
    title?: any;
    user_id?: string;
    ward?: any;
    company_working?: any;
    position?: string;
    department?: any;
    name?: string;
  };
  username?: string;
}

export interface Caption {
  module: string;
  page?: string;
  data: DataCaption[];
}

export interface DataCaption {
  code: string;
  company: string;
  lang: string;
  module: string;
  name: string;
  page: string;
  group_no: string;
}
