export const environment = {
  production: false,
  APP: {
    SECRET_KEY: 'ait',
    HOST: 'http://127.0.0.1',
    PORT: 3002,
    API_PREFIX: '/rest-api/v1',
    HOST_DOMAIN: 'http://192.168.136.17',
  },
  API_CORE: {
    HOST: 'http://192.168.136.17:4002',
    MATCHING_ENGINE_PATH: '/matching-engine',
    GET: '/api/get',
    SAVE: '/api/save',
    REMOVE: '/api/remove',
    SEARCH: '/api/search',
    EXCUTE_FUCTION: '/api/execute-function',
    MATCHING: '/matching',
    AUREOLE_V: '/sync/aureole-v',
  },
  DATABASE: {
    HOST: 'http://192.168.136.17:8529/',
    NAME: 'ait-matching-system-starter',
    USER: 'ait-matching-system-starter',
    PASS: 'ait-matching-system-starter',
  },
};
