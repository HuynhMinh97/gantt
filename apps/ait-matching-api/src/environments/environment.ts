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
  },
  API_CORE: {
    HOST: 'http://192.168.136.17:4001',
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
    NAME: 'ait_matching_dev',
    USER: 'ait_matching_dev',
    PASS: 'ait_matching_dev',
  },
};
