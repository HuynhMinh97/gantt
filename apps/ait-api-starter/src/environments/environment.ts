export const environment = {
  production: false,
  isMatching : true,
  APP: {
    SECRET_KEY: 'ait',
    HOST: 'http://127.0.0.1',
    PORT: 3002,
    API_PREFIX: '/rest-api/v1',
    GRAPHQL_PREFIX: '/api/v1',
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
<<<<<<< HEAD
    NAME: 'aureole_v_dev_matching',
=======
    NAME: 'aureole_v_dev',
>>>>>>> upstream/master
    USER: 'aureole_v_dev',
    PASS: 'aureole_v_dev',
  },
};