/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitUserService, AitAppUtils, MODULES, PAGES, getCaption, AitTranslationService, PASSWORD_LENGTH
} from '@ait/ui';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AppState } from '@ait/ui';
import { Apollo } from 'apollo-angular';

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
  repeat_password = '1005'

  constructor(
    private router: Router,
    authService: AitAuthService,
    toastrService: NbToastrService,
    store: Store<AppState>,
    userService: AitUserService,
    envService: AitEnvironmentService,
    translateService: AitTranslationService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, userService, envService);
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

    store.pipe(select(getCaption)).subscribe(c => {
      this.emailLabel = translateService.translate(this.emailLabel);
      this.passwordLabel = translateService.translate(this.passwordLabel);
      this.repeat_password = translateService.translate(this.repeat_password);
    })
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
      this.checkRequired(value, this.emailLabel), // method này mình dùng để check required
      // this.checkMaxLength(value, 5), // method này dùng để check maxlength nè 😋😋
    ];
    this.setErrors({
      email: errorList,
    });
  }

  getErrorPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.passwordLabel),
      this.checkMinLength(value, PASSWORD_LENGTH, this.passwordLabel),
    ];
    this.setErrors({
      password: errorList,
    });
  };

  getErrorRepeatPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.passwordLabel),
      this.checkMinLength(value, PASSWORD_LENGTH, this.passwordLabel),
    ];
    this.setErrors({
      password_repeat: errorList,
    });
  };


  // handleSignUp = () => {
  //   this.isLoading = true;
  //   this.clearErrors();
  //   const { email, password, password_repeat, term } = this.signupCtrl.value;
  //   if (password !== password_repeat) {
  //     this.errors = [
  //       ...this.errors,
  //       { id: 'all', message: 'Password and password repeat are not matched' },
  //     ];
  //     this.isLoading = false;
  //   } else if (!email || !password || !password_repeat) {
  //     this.errors = [
  //       ...this.errors,
  //       { id: 'all', message: 'Please input full fields' },
  //     ];
  //     this.isLoading = false;
  //   } else if (!term) {
  //     this.errors = [
  //       ...this.errors,
  //       { id: 'term', message: 'あなたはまだ私たちのルールを受け入れていません' },
  //     ];
  //     this.isLoading = false;
  //   } else {
  //     this.authService.register({ email, password }).then((res) => {
  //       if (res === undefined) {
  //         this.errors = [
  //           ...this.errors,
  //           { id: 'term', message: 'Email was existed!' },
  //         ];
  //         this.isLoading = false;
  //       }
  //       if (res?.status === 400) {
  //         this.errors = [...this.errors, { id: 'term', message: res?.message }];
  //         this.isLoading = false;
  //       } else {
  //         setTimeout(() => {
  //           this.loginHandle(email, password);
  //         }, 500);
  //       }
  //     });
  //   }
  // };

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
        this.authService.register(email, password).then(result => {
          console.log(result)
          if (result) {
            this.authService.saveTokens(result?.token, result?.refreshToken);
            const userInfo = this.authService.decodeJWT(result?.token);
            console.log(userInfo)
            this.userService.getUserInfo(userInfo['user_key']).then(r => {
              console.log(r)
              const userfind = r ? r[0] : null;
              if (userfind?.email) {
                // this.setupUserSetting(this.authService.getUserID(), this.company);
                this.router.navigateByUrl('/')
              }
              this.isLoading = false;
            })

          }
        }).catch(e => console.log(e))
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
