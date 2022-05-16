export const environment = {
  production: true,
  isMatching: true,
  default: true,
  COMMON: {
    COMPANY_DEFAULT: 'a8cd83a1-5a4d-4500-8751-a790d649c398',
    LANG_DEFAULT: 'en_US',
    LOCALE_DEFAULT: 'en-US',
    VERSION: 'v1.1',
    HEADER: 'Matching System v1.0',
  },
  API_PATH: {
    BASE_REST_PREFIX: '/rest-api/v1',
    BASE_GRAPHQL_PREFIX: '/api/v1',
    RECOMMENCED: {
      MATCHING_USER: '/recommenced/matching',
    },
    AIT: {
      RECOMMENCED_USER: {
        MATCHING_COMPANY: '/recommenced-user/matching-company',
        GET_DETAIL_MATCHING: '/recommenced-user/get-detail',
        GET_COMPANY_PROFILE: '/recommenced-user/get-company-profile',
        GET_TAB_SAVE: '/recommenced-user/get-tab-save',
        SEARCH_COMPANY: '/recommenced-user/search-company',
        SAVE_COMPANY_USER: '/recommenced-user/save-company-user',
        REMOVE_SAVE_COMPANY_USER: '/recommenced-user/remove-save-company-user',
      },
      RECOMMENCED_JOB: {
        MATCHING_USER: '/recommenced-job/matching-user',
        GET_DETAIL_MATCHING: '/recommenced-job/get-detail',
        GET_USER_PROFILE: '/recommenced-job/get-user-profile',
        GET_TAB_SAVE: '/recommenced-job/get-tab-save',
        SEARCH_USER: '/recommenced-job/search-user',
        SAVE_USER_JOB: '/recommenced-job/save-user-job',
        REMOVE_SAVE_USER_JOB: '/recommenced-job/remove-save-user-job',
      },
    },
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
    COMPANY: {
      SAVE: '/company/save',
    },
  },
};
