/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */

export enum PERMISSIONS {
  ROOT = 'root',
  USER = 'user',
  ADMIN = 'admin',
  ANONYMOUS = 'anonymous',
}

export const ACTION_HEADER = [
  {
    icon: 'home-outline',
    title: 'c_1001',
    action: () => {},
    isI18n: true,
    link: '/',
  },
];

export enum PAGES {
  //auth
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  RESET_PASSWORD = 'reset_password',
  CHANGE_PASSWORD = 'change_password',

  //user
  USER_SETTING = 'user_setting',
  USER_PROFILE = 'user_profile',

  //company
  COMPANY_INFO = 'company_info',

  //recommenced
  RECOMMENCED_USER = 'recommenced_user',
  RECOMMENCED_JOB = 'recommenced_job',

  //job
  JOB_EDIT = 'job_edit',
}

export enum MODULES {
  AUTH = 'auth',
  USER = 'user',
  RECOMMENCED_USER = 'recommenced_user',
  RECOMMENCED_JOB = 'recommenced_job',
  USER_PROFILE = 'user_profile',
  COMPANY = 'company',
  JOB = 'job',
}

export enum COMMON_KEYS_I18N {
  COMMA = 'common.system.key.comma',
}

export interface TabView {
  tabIcon: string;
  title: string;
  type: string;
}

export enum JOB_STATUS {
  DRAFT = '0',
  OPEN = '1',
  CLOSE = '2',
}

export const jwtConstants = {
  secret: 'aureole-v',
};
export interface MenuUser {
  header_title?: string;
  tabs?: MenuItem[];
}

export interface MenuItem {
  iconName?: string;
  title?: string;
  action?: any;
  url?: string;
  pack?: string;
  tag?: string;
  url_sub?: string;
  sub_menus?: MenuItem[];
}
export interface MenuHeader {
  title?: string;
  iconName?: string;
  url?: string;
}

// Add your menu here
export const MENU_USER: MenuUser[] = [
  {
    header_title: 'c_1003',
    tabs: [
      {
        iconName: 'settings-outline',
        title: 'c_1004',
        action: () => {},
        url: '/user-setting',
      },
      {
        iconName: 'edit-outline',
        title: 'c_1005',
        action: () => {},
        url: '/change-password',
      },
      {
        iconName: 'log-out-outline',
        title: 'c_1006',
        action: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.setItem('isRemember', JSON.stringify(false));
        },
        url: '/sign-in',
      },
    ],
  },
  // {
  //   header_title: 'common.menu-user.manage',
  //   tabs: [
  //   ]
  // }
];

export enum MODE {
  NEW = 'NEW',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
}

export enum TYPE {
  COMPANY = 'sys_company',
  MASTER_DATA = 'sys_master_data',
  CAPTION = 'sys_caption',
}

export const DarkScreen = [
  'sign-in',
  'sign-up',
  'reset-password',
  'change-password',
];

export const ErrorScreen = ['404', '500', '403', '503'];

export enum CURRENCY_SYMBOL {
  ja = 'JPY',
  en = 'USD',
  vi = 'VND',
}

export const MENU_HEADER: MenuHeader[] = [
  {
    iconName: 'home-outline',
    title: 'common.header.home',
    url: '/',
  },
  {
    iconName: 'keypad-outline',
    title: 'common.header.network',
    url: '/',
  },
  {
    iconName: 'file-add-outline',
    title: 'common.header.post-a-job',
    url: '/',
  },
  {
    iconName: 'message-circle-outline',
    title: 'common.header.your-message',
    url: '/',
  },
  {
    iconName: 'bell-outline',
    title: 'common.header.notifications',
    url: '/',
  },
];

export const LayoutHome = [];

export const APP_LOGO = '../assets/images/logo4.svg';

export const APP_TITLE = 'matching system';

export const APP_HEADER = 'AIT FRAMEWORK';

export const AppLayout = [
  {
    id: 'menu_user',
    value: MENU_USER,
  },
];

export const PASSWORD_LENGTH = 8;

export const MAX_FILE_DEFAULT = 1;

export const FILE_TYPE_SUPPORT_DEFAULT =
  'jpg,jpeg,png,gif,doc,docx,xls,xlsx,json,csv,pdf';

export const aureole_logo_header = `
`;

export const SYSTEM_DEFAULT_COMPANY = Array(36).fill(0).join('');
