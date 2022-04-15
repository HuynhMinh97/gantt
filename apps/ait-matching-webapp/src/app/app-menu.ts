/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
export const MENU_ITEMS: MenuUser[] = [
  {
    header_title: 'c_1003',
    tabs: [
      {
        iconName: 'settings-outline',
        title: 'c_1007',
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
  }
];

export interface MenuUser {
  header_title?: string;
  tabs?: MenuItem[];
}

export interface MenuItem {
  iconName?: string;
  title?: string;
  action?: any;
  url?: string;
}
