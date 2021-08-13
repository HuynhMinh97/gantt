import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { APP_TITLE } from '../../../@constant';
import { AitBaseComponent } from '../../../components/base.component';
import { AitAuthService, AitEnvironmentService, AitTranslationService, AitUserService } from '../../../services';
import { AppState } from '../../../state/selectors';
import { AitAppUtils } from '../../../utils/ait-utils';

@Component({
  selector: 'ait-common-layout',
  templateUrl: './ait-common-layout.component.html',
  styleUrls: ['./ait-common-layout.component.scss']
})
export class AitCommonLayoutComponent extends AitBaseComponent {
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
    private router: Router,
    private sidebarService: NbSidebarService,
    env: AitEnvironmentService,
    private translateService: AitTranslationService,
    store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    userService: AitUserService
  ) {
    super(store, authService, apollo, userService, env);
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
    return this.translateService.translate(APP_TITLE) + ' ' + target?.COMMON?.VERSION
  }

  navigateHome = () => this.router.navigateByUrl('');

  getTranslateTitle = (name) => this.translateService.translate(APP_TITLE)

  isAureoleV = () => {
    const target: any = this.env;
    return !target?.default;
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    return false;
  }

  checkSubmit(event) {
    event.preventDefault();
    // this.callLoadingApp();

    // setTimeout(() => {
    //   this.cancelLoadingApp()
    // }, 1500)

  }

}
