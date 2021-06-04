export const environment = {
  production: true,
  APP: {
    SECRET_KEY: 'AIT_SECRET_KEY',
    HOST: 'http://127.0.0.1',
    PORT: 3004,
    API_PREFIX: '/api/v1',
    HOST_DOMAIN: 'https://aureole-v.aureole-it.vn',
  },
  API_CORE: {
    HOST: 'http://127.0.0.1:4004',
    MATCHING_ENGINE_PATH: '/matching-engine',
    GET: '/api/get',
    SAVE: '/api/save',
    REMOVE: '/api/remove',
    SEARCH: '/api/search',
    EXCUTE_FUCTION: '/api/execute-function',
    MATCHING: '/matching',
    AUREOLE_V: '/sync/aureole-v',
  },
  MAIL: {
    USER: 'ait.dev@ait.com',
    PASS: '@itteam.AIT',
    HOST: '192.168.136.11',
    POST: 25,
  },
};
