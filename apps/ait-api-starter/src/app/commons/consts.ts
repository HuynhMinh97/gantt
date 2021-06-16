import { environment } from './../../environments/environment';
export const jwtConstants = {
  secret: environment.APP.SECRET_KEY,
};
export const AUTH_MESSAGES = {
  UNAUTHORIZED_EMAIL_IN_USE: 'The email already exists',
  UNAUTHORIZED_USER_IN_USE: 'The user already exists',
  UNAUTHORIZED_INVALID_PASSWORD: 'Invalid password',
  UNAUTHORIZED_INVALID_EMAIL: 'The email does not exist',
  UNAUTHORIZED_INVALID_USER: 'The user does not exist',
  UNAUTHORIZED_UNRECOGNIZED_BEARER: 'Unrecognized bearer of the token',
};
export const DB_CONNECTION_TOKEN = 'DbConnectionToken';
export const USER_MODEL_TOKEN = 'UserModelToken';
export const PWD_DEFAULT = 'aitaitait';
export const LOG_TEMPLATE = {
  REQUEST_MODEL: 'REQUEST_MODEL',
  REQUEST_CORE_MODEL: 'REQUEST_CORE_MODEL',
  RESPONSE_CORE_MODEL: 'RESPONSE_CORE_MODEL',
  RESPONSE_MODEL: 'RESPONSE_MODEL',
  EXCEPTION: 'EXCEPTION',
  CORE_URL: 'CORE_URL'
};
