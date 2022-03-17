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
  user_permissions: string;
  user_setting?: any;
  app_loading: boolean;
  show_snackbar: any;
  currencySymbol?: string;
  isRemmemberMe?: boolean;
  commonMessages?: any;
}



export interface ThemeReducer {
  theme: string;
}


export interface UserInfo {
  user_id?: string;
  email?: string;
  company?: string;
  user_profile?: {
    country_region?: any,
    date_of_birth?: string,
    district?: any,
    first_name?: string,
    floor_building?: any,
    gender?: any,
    industry?: any,
    introduce?: string,
    katakana?: string,
    last_name?: string,
    phone_number?: string,
    postcode?: any
    province_city?: any
    romaji?: string
    street?: any,
    title?: any,
    user_id?: string,
    ward?: any,
    company_working?: any;
    position?: string;
    department?: any;
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
}
