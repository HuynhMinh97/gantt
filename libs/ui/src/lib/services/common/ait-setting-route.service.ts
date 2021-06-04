import { Component, Injectable, Type } from '@angular/core';
import { PAGES } from '../../@constant';



@Injectable({
  providedIn: 'root'
})
export class AitSettingsService {

  currentSettings: any;
  components: RouteComponents[] = []

  setInitialComponents = (routes: any[]) => {
    this.components = routes;
  }

  async loadSettings() {
    console.log(this.components);
    const screens = [PAGES.RESET_PASSWORD, PAGES.SIGNIN, PAGES.SIGNUP];
    const returnField = {
      _key: true,
      name: true,
      module: true,
      code: true,

      slug: true,
      param: true
    };
    const conditions = {
      active_flag: true,
    }
    // const result = await this.query('getAllPage', returnField, conditions);
    // console.log(result);
    // const router = this.injector.get(Router);
    // // console.log(router);
    // this.currentSettings = result;
    // // const component = this.components.find(f => f?.code === 'signin');
    // // router.config.push({
    // //   path: `sign-in`,
    // //   component: component?.component,
    // //   // canActivate : [component.activeClass]
    // //      canActivate: [AitAuthScreenService],
    // // });
    // this.currentSettings.forEach(element => {
    //   const component = this.components.find(f => f?.code === element?.code);
    //   if (element?.param) {
    //     router.config.push({
    //       path: `${element.slug}/:param`,
    //       component: component?.component,
    //       // canActivate : [component.activeClass]
    //       // canActivate: screens.includes(element?.code) ? [AitAuthScreenService] : [AitAuthGuardService]
    //     });
    //   }
    //   else {
    //     router.config.push({
    //       path: `${element.slug}`,
    //       component: component?.component,
    //       // canActivate: screens.includes(element?.code) ? [AitAuthScreenService] : [AitAuthGuardService]
    //     });
    //   }
    // });
    // console.log(router)
  }
}
export interface RouteComponents {
  component: Type<Component>;
  code: string;
  activeClass: any;
}

// export const MappingRouteComponents = {
//   auth: {
//     [PAGES.SIGNIN]: {
//       component : AitLogin
//     }
//   }
// }
