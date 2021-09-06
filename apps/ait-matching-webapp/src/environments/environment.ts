export const environment = {
  production: false,
  COMMON: {
    COMPANY_DEFAULT: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
    LANG_DEFAULT: 'ja_JP',
    LOCALE_DEFAULT: 'ja-JP',
    VERSION: 'v1.1',
  },
  API_PATH: {
    BASE_REST_PREFIX: '/rest-api/v1',
    BASE_GRAPHQL_PREFIX:'/api/v1',
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
};
