export enum KEYS {
  KEY = '_key',
  FROM = '_from',
  TO = '_to',
  VIEW = 'view',
  START_VERTEX = 'start_vertex',
  DIRECTION = 'direction',
  COMPANY = 'company',
  USER_ID = 'user_id',
  LANG = 'lang',
  MODULE = 'module',
  PAGE = 'page',
  ID = 'id',
  DEFAULT_VALUE = 'defaultValue',
  CODE = 'code',
  PARENT_CODE = 'parent_code',
  CLASS = 'class',
  NAME = 'name',
  MESSAGE = 'message',
  VALUE = 'value',
  ACTIVE_FLAG = 'active_flag',
  STATUS = 'status',
  SORT_NO = 'sort_no',
  CREATE_BY = 'create_by',
  CREATE_AT = 'create_at',
  CHANGE_BY = 'change_by',
  CHANGE_AT = 'change_at',
  DATA_FLAG = 'data_flag',
  TOKEN = 'token',
  CONDITION = 'condition',
  DATA = 'data',
  COLLECTION = 'collection',
  SELECT_FIELD = 'select_field',
  ORDER_BY = 'order_by',
  DOC = 'doc',
  TYPE = 'type',
  OPERATOR = 'operator',
  ASC = 'asc',
  DESC = 'desc',
  EDGE = 'edge',
  VERTEX = 'vertex',
  PATH = 'path',
  CATEGORY = 'category',
  RELATIONSHIP = 'relationship',
  SUBJECT = 'subject',
  TEXT = 'text',
  HTML = 'html',
  NULL = 'NULL',
  NONE = '',
  CANCEL = 'CANCEL',
  CLONE = 'Clone',
  DISTRICT = 'district',
  CITY = 'province_city',
  COUNTRY = 'country_region',
  ADDRESS = 'ADDRESS',
  INDUSTRY = 'industry',
  WARD = 'ward',
  OK = 'OK',
  a1 = 'a1',
  BACK = 'back',
  INFO = 'info',
  EDIT = 'edit',
  ADMIN = 'admin',
  OBJECT = 'object',
  STRING = 'string',
  SUCCESS = 'success',
  WARNING = 'warning',
  DISPLAY = 'display_name',
  ACTIVE = 'active_flag',
  PARENT = 'parent_code',
  PRIMARY = 'primary',
  BASIC = 'basic',
  DANGER = 'danger',
  CREATE = 'create',
  UPDATE = 'update',
  JOINERS = 'JOINERS',
  CONTINUE = 'continue',
  CLASS_CODE = 'class_code',
  TOP5 = 'TOP5',
  OTHER = 'Other',
  ALL = 'ALL',
  OPEN = 'OPEN',
  DRAFT = 'DRAFT',
  CLOSED = 'CLOSED',
  EVALUATED = 'EVALUATED',
  UNEVALUATED = 'UNEVALUATED',
  COMPANY_SIZE = 'COMPANY_SIZE',
  SKILL_CATEGORY = 'SKILL_CATEGORY',
  TEST2 = 'c0fe81cb-1f50-4c04-942b-2920023147c1',
  TEST = 'c0fe81cb-1f50-4c04-942b-2920023147c0',
  INVITATIONS = 'INVITATIONS',
  CONNECTION = 'CONNECTION',
  EMAIL = "email",
  XLSX = ".xlsx",
  CSV = ".csv",
  EN = 'en_US',
  COMPANY_KEY = 'company_key',
  JOB_COMPANY = 'job_company',
  FILE_KEY = 'file_key',
  IDS = 'ids',
  DEL_FLAG = 'del_flag',
  IS_MATCHING = 'is_matching',
  CUSTOM = '$$$$@@@@!!!!',
  OTHERS = 'OTHERS',
}

export enum ACTIVE_FLAG {
  TRUE = 'true',
  FALSE = 'false'
}

export enum DATA_STATUS {
  USER = 0,
  SYSTEM = 1,
  ONBOARDING = 2
}

export enum JOB_STATUS {
  DRAFT = 0,
  OPEN = 1,
  CLOSE = 2,
  DELETE = 3
}

export enum CONNECTION_STATUS {
  INVITED = 'INVITED',
  APPLIED = 'APPLIED',
  ACCEPTED = 'ACCEPTED',
  APPROVED = 'APPROVED',
  JOINED = 'JOINED',
  NOT_FOR_ME = 'NOT_FOR_ME',
  FRIEND = 'FRIEND',
  BLOCKED = 'BLOCKED'
}

export enum RESULT_STATUS {
  ERROR = 500,
  OK = 200,
  INFO = 'INFO',
  EXCEPTION = 'EXCEPTION'
}

export enum API_METHOD {
  GET = 'GET',
  POST = 'POST'
}

export enum SYMBOLS {
  COMMA = ',',
  DOT = '.',
  EQUAL = '=',
  PERCENTAGE = '%',
  QUOTE_SINGLE = "'",
  QUOTE_DOUBLE = '"',
  SLASH = '/'
}

export enum DATA_TYPE {
  COMPANY = 'COMPANY',
  SKILL = 'SKILL',
  INDUSTRY = 'INDUSTRY',
  TITLE = 'TITLE',
  MASTER = 'MASTER',
  CERTIFICATE_AWARD = 'CERTIFICATE_AWARD',
  TRAINING_CENTER = 'TRAINING_CENTER',
  SCHOOL = 'SCHOOL'
}

export enum PERMISSIONS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ'
}

export enum GRAPHQL {
  // System collection
  FIND_SYSTEM = 'findSystem',
  SAVE_SYSTEM = 'saveSystem',
  REMOVE_SYSTEM = 'removeSystem',
  // Binary data
  FIND_BINARY_DATA = 'findBinaryData',
  SAVE_BINARY_DATA = 'saveBinaryData',
  REMOVE_BINARY_DATA = 'removeBinaryData',
  // User settings
  FIND_USER_SETTING = 'findUserSetting',
  FIND_USER_SETTING_CUSTOM = 'findUserSettingCustom',
  SAVE_USER_SETTING = 'saveUserSetting',
  REMOVE_USER_SETTING = 'removeUserSetting',
  // Auth
  LOGIN = 'login',
  SET_ENCRYPT_PASSWORD = 'setEncryptPassword',
  VALIDATE_TOKEN = 'validateToken',
  REGISTER = 'register',
  GENERATE_TOKEN = 'generateToken',
  CHANGE_PASSWORD = 'changePassword',
  FIND_USER = 'findByConditionUser',
  CHECK_PASSWORD = 'checkPassword',

  FIND_MODULE = 'findSysModule',
  FIND_GROUP = 'findSysGroup',
  FIND_PAGE = 'findSysPage',
  FIND_SEARCH_CONDITIONS = 'findSysSearchCondition',
  FIND_SEARCH_RESULT = 'findSysSearchResult',
  FIND_SYS_INPUT = 'findSysInput',
  FIND_SYS_VIEW = 'findSysView',
  FIND_DATA_BY_COLLECTION = 'findDataByCollection',
  FIND_ALL_DATA_BY_COLLECTION = 'findAllDataByCollection',
  SAVE_DATA_RENDER = 'saveDataRender'
}

export enum COLLECTIONS {
  USER = 'sys_user',
  CAPTION = 'sys_caption',
  MODULE = 'sys_module',
  GROUP = 'sys_group',
  PAGE = 'sys_page',
  MESSAGE = 'sys_message',
  CLASS = 'sys_class',
  MASTER_DATA = 'sys_master_data',
  USER_SETTING = 'user_setting',
  SYS_BINARY_DATA = 'sys_binary_data',
  USER_PROFILE = 'user_profile',
  EXAMPLE = 'example',
  COMPANY = 'sys_company',
  M_SKILL = 'm_skill',
  SEARCH_CONDITIONS = 'sys_search_condition',
  SEARCH_RESULT = 'sys_search_result',
  SYS_INPUT = 'sys_input',
  SYS_VIEW = 'sys_view',
}

export enum OPERATOR {
  EQUAL = '==',
  INEQUAL = '!=',
  LESS_THAN = '<',
  LESS_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_OR_EQUAL = '>=',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
  MATCH_REGEXP = '=~',
  NOT_MATCH_REGEXP = '!~'
}

export enum ORDER_BY {
  ASC = 'ASC',
  DESC = 'DESC',
}
