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
import _ from 'lodash';

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
    private envService: AitEnvironmentService
  ) {
    super(store, authService, apollo, userService, envService);
    this.setModulePage({
      page: PAGES.SIGNIN,
      module: MODULES.AUTH,
    });

    store.pipe(select(getCaption)).subscribe((c) => {
      this.emailLabel = translateService.translate(this.emailLabel);
      this.passwordLabel = translateService.translate(this.passwordLabel);
    });
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
  requireMessage = '';
  lengthMessage = '';
  isShowPassword = false;
  toggleShowPass = () => (this.isShowPassword = !this.isShowPassword);
  navigateToResetPassword = () => {
    this.router.navigateByUrl('/reset-password');
  };
  navigateToSignUp = () => {
    this.router.navigateByUrl('/sign-up');
  };
  navigateToDB = () => this.router.navigateByUrl('/');
  navigateToHome = () => this.router.navigateByUrl('/');
  naviagteToOnBoarding = (user_key: string) =>
    this.router.navigateByUrl('/', { state: { user_key } });
  formLoginCtrl: FormGroup;
  isRemember = false;

  setErrors = (newState: { email?: any[]; password?: any[] }) =>
    (this.errors = { ...this.errors, ...newState });

  async ngOnInit() {
    if (history.state?.email) {
      this.formLoginCtrl.setValue({
        ...this.formLoginCtrl.value,
        email: history.state?.email,
      });
    }

    const res = await this.getMessageByTypeAndCode('E', ['0001', '0010']);
    this.lengthMessage = res?.data['findSystem']?.data[0]?.message[this.lang || this.env?.COMMON?.LANG_DEFAULT] || '';
    this.requireMessage = res?.data['findSystem']?.data[1]?.message[this.lang || this.env?.COMMON?.LANG_DEFAULT] || '';
  }

  isAureoleV = () => {
    const target: any = this.envService;
    return !target?.default;
  };

  getErrorEmailMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.emailLabel), // method này mình dùng để check required
      // this.checkMaxLength(value, 5), // method này dùng để check maxlength nè 😋😋
    ];
    
    if (this.requireMessage && _.isEqual(errorList, ['E0001'])) {
      const message = this.requireMessage.replace('{0}', this.emailLabel);
      this.setErrors({
        email: [message],
      });
    } else {
      this.setErrors({
        email: errorList,
      });
    }
  };

  getErrorPasswordMessage = (value) => {
    const errorList = [
      this.checkRequired(value, this.passwordLabel),
      this.checkMinLength(value, PASSWORD_LENGTH, this.passwordLabel),
    ];
    const message = this.requireMessage.replace('{0}', this.passwordLabel);

    const index1 = (errorList || []).indexOf('E0001');
    const index2 = (errorList || []).indexOf('E0010');

    if (index1 !== -1) {
      errorList[index1] = message;
    }
    if (index2 !== -1) {
      errorList[index2] = this.getMinLengthMessage(value, PASSWORD_LENGTH, this.passwordLabel, this.lengthMessage);
    }
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
    if (user_id && user_id !== '') {
      let user = null;
      const rest_user: any = await this.apollo
        .query({
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
        `,
        })
        .toPromise();
      const result = rest_user?.data?.findByConditionUser;
      if (result) {
        user = result[0];
      }

      return user;
    }
    return {};
  };

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  login = () => {
    this.loginHandle2().then();
  };

  loginHandle2 = async () => {
    const { email, password } = this.formLoginCtrl.value;
    this.getErrorEmailMessage(email);
    this.getErrorPasswordMessage(password);
    if (!AitAppUtils.isLogined() && !this.isErrors()) {
      const hashedPwd = await this.hashPwd(password);
      if (email && hashedPwd) {
        this.isLoading = true;
        try {
          const userLogin: any = await this.authService.login(email, hashedPwd);
          const result = userLogin?.data?.login;
          if (result) {
            this.authService.saveTokens(result?.token, result?.refreshToken);
            const userInfo = this.authService.decodeJWT(result?.token);
            const setUser = await this.getUserInfo(userInfo['user_key']);
            if (setUser?.email) {
              localStorage.setItem(
                'isRemember',
                JSON.stringify(this.isRemember)
              );
              localStorage.setItem('isCheckedToken', 'true');
              location.reload();
            }
          }
          this.isLoading = false;
        } catch (e) {
          if (!(e?.message || '').includes('email')) {
            const message = this.translateService.getMsg('E0107');
            this.setErrors({
              password: [...this.errors.password, message],
            });
          } else if ((e?.message || '').includes('email')) {
            const message = this.translateService.getMsg('E0104');
            this.setErrors({
              email: [...this.errors.email, message],
            });
          }
          this.isLoading = false;
        }
      }
    }
  };

  private hashPwd = async (pwd: string): Promise<any> => {
    const key = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(APP_SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(pwd.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  };
}
