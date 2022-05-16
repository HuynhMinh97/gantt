export const environment = {
  production: false,
  isMatching: true,
  APP: {
    SECRET_KEY: 'ait',
    HOST: 'http://127.0.0.1',
    PORT: 3001,
    API_PREFIX: '/rest-api/v1',
    GRAPHQL_PREFIX: '/api/v1',
    HOST_DOMAIN: 'http://192.168.136.17',
    DEFAULT_PERMISSIONS: ['ALL_CONTROL'],
  },
  API_CORE: {
    HOST: 'http://192.168.136.17:4001',
    MATCHING_ENGINE_PATH: '/matching-engine',
    GET: '/api/get',
    SAVE: '/api/save',
    REMOVE: '/api/remove',
    SEARCH: '/api/search',
    MATCHING: '/matching/v3',
  },
  DATABASE: {
    HOST: 'http://192.168.136.17:8529/',
    NAME: 'backup_matching_dev_2022_05_12',
    USER: 'backup',
    PASS: 'backup',
  },
};
