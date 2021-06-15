export const MENU_USER: MenuUser[] = [
  {
    header_title: 'c_1003',
    tabs: [
      {
        iconName: 'settings-outline',
        title: 'c_1007',
        action: () => { },
        url: '/user-setting'
      },
      {
        iconName: 'edit-outline',
        title: 'c_1005',
        action: () => { },
        url: '/change-password'
      },
      {
        iconName: 'log-out-outline',
        title: 'c_1006',
        action: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.setItem('isRemember', JSON.stringify(false));
        },
        url: '/sign-in'
      },
    ],
  },
  {
    header_title: 'c_1008',
    tabs: [
      {
        iconName: 'upload-outline',
        title: 'c_1009',
        action: () => { },
        url: '/sync-pe-api-setting'
      },
      {
        iconName: 'clock-outline',
        title: 'c_1010',
        action: () => { },
        url: '/sync-pe-api-history'
      },
    ]
  }
];

export interface MenuUser {
  header_title?: string;
  tabs?: MenuItem[]
}


export interface MenuItem {
  iconName?: string;
  title?: string;
  action?: any;
  url?: string;
}
