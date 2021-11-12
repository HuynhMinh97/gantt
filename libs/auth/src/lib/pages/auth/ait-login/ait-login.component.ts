/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { APP_SECRET_KEY, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
  AppState,
  AitAppUtils,
  ChangeLangage,
  getCaption,
  MODULES,
  PAGES,
  PASSWORD_LENGTH,
  RemmemberMe,
  StoreSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo, gql } from 'apollo-angular';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'ait-login',
  styleUrls: ['./ait-login.component.scss'],
  templateUrl: './ait-login.component.html',
})
export class AitLoginComponent extends AitBaseComponent implements OnInit {
  isLoading = false;
  emailLabel = '002';
  passwordLabel = '003';

  constructor(
    private router: Router,
    apollo: Apollo,
    authService: AitAuthService,
    store: Store<AppState>,
    public toastrService: NbToastrService,
    private translateService: AitTranslationService,
    userService: AitUserService,
    private envService: AitEnvironmentService,

  ) {

    super(store, authService, apollo, userService, envService);
    console.log(this.allMessages)
    this.setModulePage({
      page: PAGES.SIGNIN,
      module: MODULES.AUTH
    })
    // this.getPageInfo(PAGES.SIGNIN).then(page => {
    //   console.log('Login page', page);
    //   this.pageInfo = page;
    // })

    store.pipe(select(getCaption)).subscribe(c => {
      this.emailLabel = translateService.translate(this.emailLabel);
      this.passwordLabel = translateService.translate(this.passwordLabel);
    })
    this.formLoginCtrl = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      remmemberMe: new FormControl(false),
    });
  }
  errors = {
    email: [],
    password: [],
  };
  notifyText = '';
  isShowPassword = false;
  toggleShowPass = () => (this.isShowPassword = !this.isShowPassword);
  navigateToResetPassword = () => {
    this.router.navigateByUrl('/reset-password');
    console.log('navigate -> reset password')
  };
  navigateToSignUp = () => {
    this.router.navigateByUrl('/sign-up');
    console.log('navigate -> sign up')
  }
  navigateToDB = () => this.router.navigateByUrl('/');
  navigateToHome = () => this.router.navigateByUrl('/');
  naviagteToOnBoarding = (user_key: string) =>
    this.router.navigateByUrl('/', { state: { user_key } });
  formLoginCtrl: FormGroup;
  isRemember = false;

  setErrors = (newState: { email?: any[]; password?: any[] }) =>
    (this.errors = { ...this.errors, ...newState });

  ngOnInit() {
    console.log('Login page');
    // const item = of(localStorage.getItem('access_token'));
    // item.subscribe(d => console.log(d))
    console.log(history.state)
    if (history.state?.email) {
      this.formLoginCtrl.setValue({
        ...this.formLoginCtrl.value,
        email : history.state?.email
      })
    }
  }

  isAureoleV = () => {
    const target: any = this.envService;
    return !target?.default;
  }

  getErrorEmailMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.emailLabel), // method này mình dùng để check required
      // this.checkMaxLength(value, 5), // method này dùng để check maxlength nè 😋😋
    ];
    this.setErrors({
      email: errorList,
    });
  };

  getErrorPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.passwordLabel),
      this.checkMinLength(value, PASSWORD_LENGTH, this.passwordLabel),
    ];
    this.setErrors({
      password: errorList,
    });
  };

  handleFocus = (value, field) => {
    if (field === 'email') {
      this.getErrorEmailMessage(value);
    } else {
      this.getErrorPasswordMessage(value);
    }
  };

  handleFocusout = () => {
    const { email, password } = this.formLoginCtrl.value;
    this.getErrorEmailMessage(email);
    this.getErrorPasswordMessage(password);
  };

  isSignedin = () => AitAppUtils.isLogined();

  resetErrors = () => {
    this.notifyText = '';
    this.setErrors({
      password: [],
      email: [],
    });
  };

  setupUserSetting = (userId, company?: string) => {

    this.userService.getUserSetting(userId).then((r) => {
      const data = (r.data || []).filter(
        (f) => !!f || !AitAppUtils.isObjectEmpty(f)
      );
      if (r?.status === RESULT_STATUS.OK) {
        if (r?.data[0]?.site_language) {
          this.store.dispatch(new ChangeLangage(r.data[0].site_language?.code));
          this.store.dispatch(
            new StoreSetting({ site_language: r.data[0].site_language?.code })
          );
          this.userService.getUserSetting(userId).then((res) => {
            const result = {};
            Object.entries(res?.data[0]).forEach(([key, target]) => {
              if (target) {
                if (key === 'site_language' || key === 'timezone') {
                  result[key] = target['code'];
                } else {
                  result[key] = target;
                }
              }
            });

            this.store.dispatch(new StoreSetting(result));
          });
        } else if ((data || []).length === 0 || !data[0]?.site_language) {
          this.userService.getUserSetting(company).then((r) => {
            if (r?.data[0]?.site_language) {
              this.store.dispatch(
                new ChangeLangage(r.data[0].site_language?.code)
              );
              this.store.dispatch(
                new StoreSetting({
                  site_language: r.data[0].site_language?.code,
                })
              );
              this.userService.getUserSetting(company).then((res) => {
                const result = {};
                Object.entries(res?.data[0] || {}).forEach(([key, target]) => {
                  if (target) {
                    if (key === 'site_language' || key === 'timezone') {
                      result[key] = target['code'];
                    } else {
                      result[key] = target;
                    }
                  }
                });

                this.store.dispatch(new StoreSetting(result));
              });
            }
          });
        }
      }
    });
  };

  isErrors = () => {
    const { email, password } = this.errors;
    const err = AitAppUtils.getArrayNotFalsy([...email, ...password]);
    return err.length !== 0;
  };

  checkboxChange = (val) => {
    this.isRemember = val;
    this.store.dispatch(new RemmemberMe(val));
  };

  getUserInfo = async (user_id: string) => {
    // console.log(user_id)
    if (user_id && user_id !== '') {
      let user = null;
      const rest_user: any = await this.apollo.query({
        query: gql`
        query {
          findByConditionUser(request:{
            company: "${this.company}",
                lang: "${this.lang}",
                collection: "sys_user",
                user_id: "${user_id}",
                condition: {
                  _key : "${user_id}"
                }
          }){
            email
            username
            _key
            company
          }
        }
        `
      }).toPromise();
      const result = rest_user?.data?.findByConditionUser;
      if (result) {
        user = result[0]
      }

      return user;
    }
    return {};
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  login = () => {
    this.loginHandle2().then()
  }

  loginHandle2 = async () => {
    const { email, password } = this.formLoginCtrl.value;
    const hashedPwd = await this.hashPwd(password);
    if (!AitAppUtils.isLogined() && !this.isErrors()) {
      if (email && hashedPwd) {
        this.isLoading = true;
        try {
          const userLogin: any = await this.authService.login(email, hashedPwd);
          const result = userLogin?.data?.login;
          if (result) {
            this.authService.saveTokens(result?.token, result?.refreshToken);
            const userInfo = this.authService.decodeJWT(result?.token);
            const setUser = await this.getUserInfo(userInfo['user_key'])
            console.log(setUser);
            if (setUser?.email) {
              localStorage.setItem('isRemember', JSON.stringify(this.isRemember));
              localStorage.setItem('isCheckedToken', 'true');
              location.reload();
            }
          }
          this.isLoading = false;
        } catch (e) {
          console.log(e)
          if (!(e?.message || '').includes('email')) {
            const message = this.translateService.getMsg('E0107');
            this.setErrors({
              password: [...this.errors.password, message]
            })
          }
          else if ((e?.message || '').includes('email')) {
            const message = this.translateService.getMsg('E0104');
            this.setErrors({
              email: [...this.errors.email, message]
            })
          }
          this.isLoading = false;
        }
        // this.aitGraphQLService.login(email, hashedPwd).then((res) => {
        //   const result = res;
        //   if (result) {
        //     this.authService.saveTokens(result?.token, result?.refreshToken);
        //     const userInfo = this.authService.decodeJWT(result?.token);
        //     this.userService.getUserInfo(userInfo['user_key']).then(r => {
        //       const userfind = r ? r[0] : null;
        //       if (userfind?.email) {
        //         localStorage.setItem('isRemember', JSON.stringify(this.isRemember));
        //         // this.setupUserSetting(this.authService.getUserID(), this.company);
        //         // const item = of(localStorage.getItem('access_token'));
        //         // item.subscribe(d => console.log(d))
        //         this.router.navigate(['example']);
        //       }
        //     }
        //     )
        //   }
        //   this.isLoading = false;
        // }).catch(e => {
        //   if (!(e?.message || '').includes('email')) {
        //     const message = this.getMsg('E0107');
        //     this.setErrors({
        //       password: [...this.errors.password, message]
        //     })
        //   }
        //   else {
        //     const message = this.getMsg('E0104');
        //     this.setErrors({
        //       email: [...this.errors.email, message]
        //     })
        //   }
        //   this.isLoading = false;
        // })
      }
    }

  };

  private hashPwd = async (pwd: string): Promise<any> => {
    const key = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(pwd.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  };
}
