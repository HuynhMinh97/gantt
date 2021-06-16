import {
  AitAuthService, AitBaseComponent, AitEnvironmentService, AitLayoutService, AitUserService, AppState, DarkScreen, MENU_USER
} from '@ait/ui';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MENU_ITEMS } from './app.menus';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AitBaseComponent {
  title = 'ait-matching-webapp';
  excludeScreens = DarkScreen;
  menu = MENU_ITEMS
  constructor(
    layoutService: AitLayoutService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    userService: AitUserService,
    apollo: Apollo,
    _env: AitEnvironmentService) {
    super(store, authService, apollo, userService, _env);
    layoutService.menuUserInput = MENU_USER;
  }
}
