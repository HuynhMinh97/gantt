

export enum ACTION {
  GET = 'GET',
  SAVE = 'SAVE',
  REMOVE = 'REMOVE'
}

export enum OPERATOR {
  IN = 'IN',
  EQUAL = '=='
}

export enum CLASS {
  // SYSTEM
  SYSTEM_SETTING = 'SYSTEM_SETTING',
  USER_SETTING = 'USER_SETTING',
  TIMEZONE = 'TIMEZONE',
  GENDER = 'GENDER',
  LANGUAGE = 'LANGUAGE',
  LANGUAGE_PROFICIENCY = 'LANGUAGE_PROFICIENCY',
  ADDRESS = 'ADDRESS',
  EMPLOYEE_TYPE = 'EMPLOYEE_TYPE',
  EXPERIENCE_LEVEL = 'EXPERIENCE_LEVEL',

  // BIZ
  RESIDENCE_STATUS = 'RESIDENCE_STATUS',
  SKILL_CATEGORY = 'SKILL_CATEGORY',
  SKILL_SETTING = 'SKILL_SETTING',
  COMPANY_SIZE = 'COMPANY_SIZE',
  PREFECTURE = 'PREFECTURE',
  JP_CERTIFICATE = 'JP_CERTIFICATE',
  JOB_BUSINESS = 'JOB_BUSINESS',
  JOB_STATUS = 'JOB_STATUS',
  JOB_PREFECTURE = 'JOB_PREFECTURE',
  JOB_RESIDENCE_STATUS = 'JOB_RESIDENCE_STATUS',
  JOB_SALARY_TYPE = 'JOB_SALARY_TYPE',
  JOB_ACCOMMODATION_STATUS = 'JOB_ACCOMMODATION_STATUS',
  JOB_GENDER = 'JOB_GENDER',
  JOB_OCCUPATION = 'JOB_OCCUPATION'

}

export enum EDGE_DIRECTION {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  ANY = 'ANY'
}

export enum COLLECTIONS {
  EXAMPLE = 'example',
  // SYSTEM
  USER = 'sys_user', // collection
  MASTER_DATA = 'sys_master_data',
  USER_SETTING = 'user_setting'
}
