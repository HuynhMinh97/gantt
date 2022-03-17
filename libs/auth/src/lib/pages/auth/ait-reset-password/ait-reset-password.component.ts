import {
  AitAuthService, AitBaseComponent, AitEnvironmentService, AitUserService, AppState, MODULES, PAGES
} from '@ait/ui';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-reset-password',
  styleUrls: ['./ait-reset-password.component.scss'],
  templateUrl: './ait-reset-password.component.html',
})
export class AitResetPasswordComponent extends AitBaseComponent {
  constructor(
    private router: Router,
    store: Store<AppState>,
    authService: AitAuthService,
    userService: AitUserService,
    envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, userService, envService,);
    this.setModulePage({
      page: PAGES.RESET_PASSWORD,
      module: MODULES.AUTH
    })
  }

  isShowPassword = false;
  toggleShowPass = () => (this.isShowPassword = !this.isShowPassword);

  navigateToSignUp = () => this.router.navigateByUrl('/sign-up');
  navigateToLogin = () => this.router.navigateByUrl('/sign-in');
}
