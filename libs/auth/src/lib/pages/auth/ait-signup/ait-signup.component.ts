/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitUserService, AitAppUtils, MODULES, PAGES, AitTranslationService, PASSWORD_LENGTH
} from '@ait/ui';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AppState } from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { AitEnvironmentService as EnvService } from '../../../services/environment.service';

@Component({
  selector: 'ait-signup',
  styleUrls: ['./ait-signup.component.scss'],
  templateUrl: './ait-signup.component.html',
})
export class AitSignUpComponent extends AitBaseComponent implements OnInit {
  @HostBinding('class')
  classes = 'login__wrapper';

  emailLabel = '1002';
  passwordLabel = '1003';
  repeat_password = '1005';
  env: any;

  constructor(
    router: Router,
    authService: AitAuthService,
    toastrService: NbToastrService,
    store: Store<AppState>,
    userService: AitUserService,
    envService: AitEnvironmentService,
    private translateService: AitTranslationService,
    apollo: Apollo,
    _env: EnvService,
  ) {
    super(store, authService, apollo, userService, envService, null, toastrService, null, router);
    this.setModulePage({
      page: PAGES.SIGNUP,
      module: MODULES.AUTH
    })
    this.signupCtrl = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      password_repeat: new FormControl(''),
      term: new FormControl(false),
    });
    this.env = _env;
  }
  errors = {
    email: [],
    password: [],
    password_repeat: [],
    term: [],
    common: []
  };
  isLoading = false;
  isShowPassword = false;
  toggleShowPass = () => (this.isShowPassword = !this.isShowPassword);
  navigateToLogin = () => this.router.navigateByUrl('/sign-in');
  navigateToResetPassword = () => this.router.navigateByUrl('/reset-password');
  naviagteToOnBoarding = (user_key: string) =>
    this.router.navigateByUrl('/', { state: { user_key } });
  navigateToDB = () => this.router.navigateByUrl('/');
  signupCtrl: FormGroup;

  clearErrors = () => this.errors = {
    email: [],
    password: [],
    password_repeat: [],
    term: [],
    common: []
  } as any;

  setErrors = (newState: { email?: any[]; password?: any[], password_repeat?: any[], term?: any[], common?: any[] }) =>
    (this.errors = { ...this.errors, ...newState });

  ngOnInit() {
    const { email } = history.state;
    if (email) {
      this.signupCtrl.patchValue({ email });
    }
    this.signupCtrl.valueChanges.subscribe({
      next: () => {
        this.clearErrors();
      },
    });
  }

  handleFocus = (value, field) => {
    if (field === 'email') {
      this.getErrorEmailMessage(value);
    } else if (field === 'password') {
      this.getErrorPasswordMessage(value);
    }
    else {
      this.getErrorRepeatPasswordMessage(value);
    }
  };


  getErrorEmailMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.getFieldName(this.emailLabel)), // method này mình dùng để check required
      // this.checkMaxLength(value, 5), // method này dùng để check maxlength nè 😋😋
    ];
    this.setErrors({
      email: errorList,
    });
  }

  getErrorPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.getFieldName(this.passwordLabel)),
      this.checkMinLength(value, PASSWORD_LENGTH, this.getFieldName(this.passwordLabel)),
    ];
    this.setErrors({
      password: errorList,
    });
  };

  getErrorRepeatPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.getFieldName(this.repeat_password)),
      this.checkMinLength(value, PASSWORD_LENGTH, this.getFieldName(this.repeat_password)),
    ];
    this.setErrors({
      password_repeat: errorList,
    });
  };


  getFieldName = (name: string) => this.translateService.translate(name || '');

  isErrors = () => {
    const { email, password, password_repeat, term, common } = this.errors;
    const err = AitAppUtils.getArrayNotFalsy([...email, ...password, ...password_repeat, ...term, ...common]);
    return err.length !== 0;
  };

  handleSignUp2 = () => {

    this.clearErrors();

    const { email, password, password_repeat, term } = this.signupCtrl.value;
    this.getErrorEmailMessage(email);
    this.getErrorPasswordMessage(password);
    this.getErrorRepeatPasswordMessage(password_repeat);
    if (!term) {
      this.setErrors({
        term: ['あなたはまだ私たちのルールを受け入れていません']
      });
    }
    else if (password !== password_repeat) {
      const message1 = this.getMsg('E0101')
      this.setErrors({
        common: [message1]
      })
    }
    else {
      if (!this.isErrors()) {
        this.isLoading = true;
        this.authService.register(email, password, this.env?.COMMON?.COMPANY_DEFAULT).then(result => {
          if (result && result?.token) {
            this.showToastr(
              this.translateService.translate(
                'c_10020'
              ),
              this.translateService.getMsg('I0001'),
              'success'
            );
            this.isLoading = false;

            this.router.navigate(['/sign-in'], {
              state: {
                email
              }
            });
          }
        }).catch(e => {
          this.isLoading = false;
          this.showToastr(
            this.translateService.translate(
              'c_10020'
            ),
            this.translateService.getMsg('I0010'),
            'danger'
          );
        })
      }
    }
  }

  // loginHandle = (email: string, password: string) => {
  //   this.isLoading = true;
  //   if (!AitAppUtils.isLogined()) {
  //     if (!email || !password) {
  //     }
  //     if (email && password) {
  //       this.authService.login(email, password).then((res: any) => {
  //         if (res?.status === 406) {
  //         } else if (res?.hasUserProfile) {
  //           this.navigateToDB();
  //         } else {
  //           const user_key = this.authService.getUserID();
  //           this.naviagteToOnBoarding(user_key);
  //         }
  //         this.isLoading = false;
  //       });
  //     }
  //   } else {
  //     this.isLoading = false;
  //   }
  // };
}
