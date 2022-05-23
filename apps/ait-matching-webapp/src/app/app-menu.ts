/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
export const MENU_ITEMS = [
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
      // {
      //   iconName: 'search-outline',
      //   title: 'Job Setting',
      //   action: () => {},
      //   url: '/',
      // },
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
  //   header_title: 'MANAGE',
  //   tabs: [
  //     {
  //       iconName: 'list-outline',
  //       title: 'Auth',
  //       sub_menus: [
  //         {
  //           iconName: 'list-outline',
  //           title: 'User List',
  //           url_sub: '/user-list'
  //         },
  //         {
  //           iconName: 'list-outline',
  //           title: 'Role List',
  //           url_sub: '/role-list'
  //         }
  //       ]

  //     },
  //     {
  //       iconName: 'list-outline',
  //       title: 'Common',
  //       sub_menus: [
  //         {
  //           iconName: 'list-outline',
  //           title: 'Caption Data',
  //           url_sub: '/caption-list'
  //         },
  //         {
  //           iconName: 'list-outline',
  //           title: 'Message Data',
  //           url_sub: '/message-list'
  //         },
  //         {
  //           iconName: 'list-outline',
  //           title: 'Master Data',
  //           url_sub: '/master-data'
  //         },
  //       ]
  //     },
  //     {
  //       iconName: 'list-outline',
  //       title: 'Master',
  //       sub_menus: [
  //         {
  //           iconName: 'list-outline',
  //           title: 'Skill List',
  //           url_sub: '/skill-list'
  //         },
  //       ]
  //     },
  //   ]
  // }
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
