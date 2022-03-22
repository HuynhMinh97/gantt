/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { APP_HEADER, APP_TITLE } from '../../../@constant';
import { AitBaseComponent } from '../../../components/base.component';
import {
  AitAuthService,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
} from '../../../services';
import { AppState } from '../../../state/selectors';
import { AitAppUtils } from '../../../utils/ait-utils';

@Component({
  selector: 'ait-common-layout',
  templateUrl: './ait-common-layout.component.html',
  styleUrls: ['./ait-common-layout.component.scss'],
})
export class AitCommonLayoutComponent extends AitBaseComponent {
  @Input() excludeHeaderScreens = [];
  currentPath = '';
  title = '';
  @Input() menu_actions: [];
  @Input()
  hasSidebar = false;
  gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';
  environment: any;

  isExcludeScreen = () => this.excludeHeaderScreens.includes(this.currentPath);

  constructor(
    router: Router,
    private sidebarService: NbSidebarService,
    env: AitEnvironmentService,
    private translateService: AitTranslationService,
    store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    userService: AitUserService
  ) {
    super(store, authService, apollo, userService, env, null, null, null, router);
    this.environment = this.env;
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const path: any = AitAppUtils.getParamsOnUrl(true);
        this.currentPath = path;
      }
    });
  }
  getTitle = () => {
    return (
      this.translateService.translate(
        this.environment?.COMMON?.TITLE || APP_TITLE
      ) +
      ' ' +
      this.environment?.COMMON?.VERSION
    );
  };

  getHeader = () => {
    return (
      this.translateService.translate(
        this.environment?.COMMON?.HEADER || APP_HEADER
      )
    )
  }

  navigateHome = () => this.router.navigateByUrl('');

  getTranslateTitle = () =>
    this.translateService.translate(
      this.environment?.COMMON?.TITLE || APP_TITLE
    );

  isAureoleV = () => {
    const target: any = this.env;
    return !target?.default;
  };

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  checkSubmit(event) {
    event.preventDefault();
  }
}
