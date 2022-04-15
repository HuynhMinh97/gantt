/* eslint-disable @typescript-eslint/no-empty-function */
export const environment = {
  production: false,
  default: true,
  isMatching: true,
  COMMON: {
    COMPANY_DEFAULT: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
    LANG_DEFAULT: 'ja_JP',
    LOCALE_DEFAULT: 'ja-JP',
    VERSION: 'v1.1',
    APP_TITLE: '',
  },
  API_PATH: {
    BASE_REST_PREFIX: '/rest-api/v1',
    BASE_GRAPHQL_PREFIX: '/api/v1',
    SYS: {
      AUTH_API_PATH: '/auth',
      COMPANY: '/company',
      LANG: '/lang',
      CLASS: '/class',
      MASTER_DATA: '/master-data',
      UPLOAD: '/upload-file',
      USER: '/user',
      BINARY_DATA: '/binary-data',
      USER_PROFILE: '/user-profile',
    },
    BIZ: {
      JOB: '/jobs',
    },
  },
  MENU: [],
};
