import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { AitAppUtils } from '../../../utils/ait-utils';

@Component({
  selector: 'ait-common-layout',
  templateUrl: './ait-common-layout.component.html',
  styleUrls: ['./ait-common-layout.component.scss']
})
export class AitCommonLayoutComponent {
  @Input() excludeHeaderScreens = [];
  currentPath = '';
  @Input()
  hasSidebar = false;
  isExcludeScreen = () => this.excludeHeaderScreens.includes(this.currentPath);
  constructor(router: Router, private sidebarService: NbSidebarService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const path: any = AitAppUtils.getParamsOnUrl(true);
        this.currentPath = path;
        // console.log(this.excludeHeaderScreens.includes(this.currentPath),this.excludeHeaderScreens,this.currentPath)
      }
    })
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    return false;
  }


}
