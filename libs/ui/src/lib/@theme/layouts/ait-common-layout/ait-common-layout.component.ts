import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { APP_TITLE } from '../../../@constant';
import { AitEnvironmentService, AitTranslationService } from '../../../services';
import { AppState } from '../../../state/selectors';
import { AitAppUtils } from '../../../utils/ait-utils';

@Component({
  selector: 'ait-common-layout',
  templateUrl: './ait-common-layout.component.html',
  styleUrls: ['./ait-common-layout.component.scss']
})
export class AitCommonLayoutComponent {
  @Input() excludeHeaderScreens = [];
  currentPath = '';
  @Input() menu_actions: [];
  @Input()
  hasSidebar = false;
  title = ''
  gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';

  // logoHeader = aureole_logo_header;
  isExcludeScreen = () => this.excludeHeaderScreens.includes(this.currentPath);
  constructor(
    router: Router,
    private sidebarService: NbSidebarService,
    private env: AitEnvironmentService,
    private translateService: AitTranslationService,
    private store: Store<AppState>
  ) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const path: any = AitAppUtils.getParamsOnUrl(true);
        this.currentPath = path;
        // console.log(this.excludeHeaderScreens.includes(this.currentPath),this.excludeHeaderScreens,this.currentPath)
      }
    })
  }
  getTitle = () => {
    const target: any = this.env;
    return this.translateService.translate(APP_TITLE) + target?.COMMON?.VERSION
  }

  isAureoleV = () => {
    const target: any = this.env;
    return !target?.default;
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    return false;
  }


}
