/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitLayoutService,
  AitUserService,
  AppState,
  DarkScreen,
  getUserProfile,
  getUserInfo,
} from '@ait/ui';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MENU_ITEMS } from './app-menu';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AitBaseComponent implements OnInit {
  title = 'ait-matching-webapp';
  isAppLoading = true;
  excludeScreens = DarkScreen;
  constructor(
    store: Store<AppState | any>,
    authService: AitAuthService,
    userService: AitUserService,
    _env: AitEnvironmentService,
    layoutService: AitLayoutService,
    apollo: Apollo,
    router: Router
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      _env,
      null,
      null,
      null,
      router
    );
    store.pipe(select(getUserInfo)).subscribe(({ type }) => {
      if (type === 1) {
        layoutService.menuUserInput = MENU_ITEMS;
      } else if (type === 2) {
        const MENU2 = [...MENU_ITEMS];
        MENU2[1]['tabs'].length = 1;
        layoutService.menuUserInput = MENU2;
      } else {
        const MENU3 = [...MENU_ITEMS];
        MENU3.length = 1;
        layoutService.menuUserInput = MENU3;
      }
    });
  }

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.initBaseComponent();

    setTimeout(() => {
      const currentUrl = location.hash.replace('#', '');
      const prevUrl = localStorage.getItem('prev_url');
      if (currentUrl !== prevUrl) {
        this.router.navigateByUrl(prevUrl);
      }
    }, 50);
    setTimeout(() => {
      this.isAppLoading = false;
    }, 2000);
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler() {
    const currentUrl = location.hash.replace('#', '');
    localStorage.setItem('prev_url', currentUrl);
  }
}
