import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AitAppUtils } from '../../../utils/ait-utils';

@Component({
  selector: 'ait-common-layout',
  templateUrl: './ait-common-layout.component.html',
})
export class AitCommonLayoutComponent {
  @Input() excludeHeaderScreens = [];
  constructor(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const path: any = AitAppUtils.getParamsOnUrl(true);
        this.currentPath = path;
        // console.log(this.excludeHeaderScreens.includes(this.currentPath),this.excludeHeaderScreens,this.currentPath)
      }
    })
  }

  currentPath = '';
  isExcludeScreen = () => this.excludeHeaderScreens.includes(this.currentPath);
}
