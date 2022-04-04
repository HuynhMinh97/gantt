/* eslint-disable @typescript-eslint/no-explicit-any */
import { PAGE_TYPE, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  MODULES,
  PAGES,
  PASSWORD_LENGTH,
} from '@ait/ui';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-change-pwd',
  templateUrl: 'ait-change-password.component.html',
  styleUrls: ['./ait-change-password.component.scss'],
})
export class AitChangePwdComponent extends AitBaseComponent implements OnInit {
  data: any;
  old_passwordLabel = '1002';
  new_passwordLabel = '1003';
  repeat_passwordLabel = '1004';
  errors = {
    old_password: [],
    new_password: [],
    repeat_password: [],
    common: [],
  };
  old_passwordCtrl: FormControl;
  new_passwordCtrl: FormControl;
  repeat_passwordCtrl: FormControl;
  isShowOldPassword = false;
  isShowNewPassword = false;

  isOldPwdError = false;

  @ViewChild('oldpassword') oldpassword: ElementRef;
  constructor(
    router: Router,
    private translateService: AitTranslationService,
    authService: AitAuthService,
    toastrService: NbToastrService,
    store: Store<AppState>,
    envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, envService, null, toastrService, null, router);
    this.setModulePage({
      page: PAGES.CHANGE_PASSWORD,
      module: MODULES.AUTH,
      type: PAGE_TYPE.VIEW
    })
    this.old_passwordCtrl = new FormControl('');
    this.new_passwordCtrl = new FormControl('');
    this.repeat_passwordCtrl = new FormControl('');

    // tslint:disable-next-line: deprecation
    this.old_passwordCtrl.valueChanges.subscribe(() =>
      this.handleFocusout('old_passwordCtrl')
    );
    // tslint:disable-next-line: deprecation
    this.new_passwordCtrl.valueChanges.subscribe(() =>
      this.handleFocusout('new_passwordCtrl')
    );
    // tslint:disable-next-line: deprecation
    this.repeat_passwordCtrl.valueChanges.subscribe(() =>
      this.handleFocusout('repeat_passwordCtrl')
    );
  }

  getFieldName = (name: string) => this.translateService.translate(name || '');

  back = () => {
    history.back();
  };

  setErrors = (newState: {
    old_password?: any[];
    new_password?: any[];
    repeat_password?: any[];
    common?: any[];
  }) => {
    this.errors = { ...this.errors, ...newState };
  };

  getErrorPwd = (value) => {
    const errorList = [this.checkRequired(value, this.getFieldName(this.old_passwordLabel))];
    if (value) {
      errorList.push(
        this.checkMinLength(value, PASSWORD_LENGTH, this.getFieldName(this.old_passwordLabel))
      );
    }
    this.setErrors({
      old_password: errorList,
    });
  };

  getErrorNewPwd = (value) => {
    const errorList = [this.checkRequired(value, this.getFieldName(this.new_passwordLabel))];
    if (value) {
      errorList.push(
        this.checkMinLength(value, PASSWORD_LENGTH, this.getFieldName(this.new_passwordLabel))
      );
    }
    this.setErrors({
      new_password: errorList,
    });
  };

  getErrorRepeatPwd = (value) => {
    const errorList = [this.checkRequired(value, this.getFieldName(this.repeat_passwordLabel))];
    if (value) {
      errorList.push(
        this.checkMinLength(value, PASSWORD_LENGTH, this.getFieldName(this.repeat_passwordLabel))
      );
    }
    this.setErrors({
      repeat_password: errorList,
    });
  };

  // Ưu tiên check error email/user trước (outfocus sẽ check)
  //

  getCommonErrors = (newpwd: string, reppwd: string, oldpwd: string) => {
    const errorList = [];
    if (oldpwd && newpwd && oldpwd.length >= 8 && newpwd.length >= 8) {
      errorList.push(this.checkDif(oldpwd, newpwd));
    }

    if (newpwd && reppwd && newpwd.length >= 8 && reppwd.length >= 8) {
      errorList.push(this.checkEqual2pwd(newpwd, reppwd));
    }
    this.setErrors({
      common: errorList,
    });
  };
  filterArr = (arr: any[]) => arr.filter((f) => !!f);
  isErrorForm = () => {
    const { new_password, old_password, common, repeat_password } = this.errors;
    const errorArray = [
      ...this.filterArr(new_password),
      ...this.filterArr(old_password),
      ...this.filterArr(repeat_password),
      ...this.filterArr(common),
    ];
    return errorArray.length !== 0;
  };

  checkAllErrors = (
    name?: 'new_passwordCtrl' | 'old_passwordCtrl' | 'repeat_passwordCtrl'
  ) => {
    if (!name) {
      this.getErrorNewPwd(this.new_passwordCtrl.value);
      this.getErrorPwd(this.old_passwordCtrl.value);
      this.getErrorRepeatPwd(this.repeat_passwordCtrl.value);
      this.getCommonErrors(
        this.new_passwordCtrl.value,
        this.repeat_passwordCtrl.value,
        this.old_passwordCtrl.value
      );
    } else {
      if (name === 'new_passwordCtrl') {
        this.getErrorNewPwd(this.new_passwordCtrl.value);
      } else if (name === 'old_passwordCtrl') {
        this.getErrorPwd(this.old_passwordCtrl.value);
      } else {
        this.getErrorRepeatPwd(this.repeat_passwordCtrl.value);
      }
      this.getCommonErrors(
        this.new_passwordCtrl.value,
        this.repeat_passwordCtrl.value,
        this.old_passwordCtrl.value
      );
    }
  };

  handleFocusout = (
    name?: 'new_passwordCtrl' | 'old_passwordCtrl' | 'repeat_passwordCtrl'
  ) => {
    this.checkAllErrors(name);
  };

  enter = () => {
    return false;
  };

  checkPwd = async () => {
    if (this.old_passwordCtrl.value !== '') {
      const check: any = await this.authService.checkPwd(this.old_passwordCtrl.value);
      const data = check.data?.checkPassword;
      if (data) {
        if (!data?.isMatched) {
          this.isOldPwdError = true;
          this.oldpassword.nativeElement.focus();
          this.setErrors({
            old_password: [this.getMsg('E0107')],
            new_password: [],
            common: [],
            repeat_password: [],
          });
        } else {
          this.isOldPwdError = false;
          this.setErrors({
            old_password: [],
          });
        }
      }
    }
  };

  save = async () => {
    await this.checkPwd();
    if (!this.isOldPwdError) {
      this.checkAllErrors();
    }
    if (!this.isErrorForm() && !this.isOldPwdError) {
      this.authService
        .changePwd({
          new_password: this.new_passwordCtrl.value,
          old_password: this.old_passwordCtrl.value,
        })
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.showToastr(
              this.translateService.translate(
                'c_10020'
              ),
              this.translateService.translate(
                'c_10021'
              ),
              'success'
            );
            this.authService.generateTokens();
            this.goBack();
          } else {
            this.setErrors({
              common: [this.getMsg('E0107')],
            });
          }
        });
    }
  };

  save2 = async () => {
    await this.checkPwd();
    if (!this.isOldPwdError) {
      this.checkAllErrors();
    }
    if (!this.isErrorForm() && !this.isOldPwdError) {
      this.isLoading = true;
      this.authService.changePassword(this.old_passwordCtrl.value,
        this.new_passwordCtrl.value).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.showToastr(
              this.translateService.translate(
                'c_10020'
              ),
              this.translateService.translate(
                'c_10021'
              ),
              'success'
            );
            // this.authService.generateTokens();
            this.isLoading = false;
            this.goBack();
          } else {
            this.setErrors({
              common: [this.getMsg('E0107')],
            });
            this.isLoading = false;
          }
        }).catch(e => {
          this.isLoading = false;
        })
    }
  };

  toggleShowOldPass = () => (this.isShowOldPassword = !this.isShowOldPassword);
  toggleShowNewPass = () => (this.isShowNewPassword = !this.isShowNewPassword);

  navigateToSignUp = () => this.router.navigateByUrl('/sign-up');
  navigateToLogin = () => this.router.navigateByUrl('/sign-in');
}
