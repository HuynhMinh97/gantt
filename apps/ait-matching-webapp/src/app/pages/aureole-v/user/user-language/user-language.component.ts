// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserLanguageService } from './../../../../services/user-language.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbDialogRef,
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitNavigationService,
  AitTranslationService,
  AppState,
  MODE,
  MODULES,
  PAGES,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-language',
  templateUrl: './user-language.component.html',
  styleUrls: ['./user-language.component.scss'],
})
export class UserLanguageComponent extends AitBaseComponent implements OnInit {
  // Create form group
  userLanguageInfo: FormGroup;
  userLanguageInfoClone: any;
  defaultValueDate: Date = new Date();

  mode = MODE.NEW;
  errorArr: any;
  isSave = false;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;

  resetUserLangInfo = {
    language: false,
    proficiency: false,
  };

  user_key = '';
  user_id = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userLangService: UserLanguageService,
    private translateService: AitTranslationService,
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService
    );

    this.setModulePage({
      module: 'user',
      page: 'user_language',
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });

    this.userLanguageInfo = this.formBuilder.group({
      language: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      proficiency: new FormControl(null),
    }); 
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    setTimeout(() => {
      this.cancelLoadingApp();
    },500);
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.user_key) {
      await this.userLangService
        .findUserLanguageByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isExist = false;
            const data = r.data[0];
            if (r.data.length > 0 && !data.del_flag) {
              this.userLanguageInfo.patchValue({ ...data });
              this.userLanguageInfoClone = this.userLanguageInfo.value;
              this.user_id = data.user_id;
              isExist = true;
            }           
            // !isExist && this.router.navigate([`/404`]);
          }
        });
    }
    // Run when form value change
    this.userLanguageInfo.valueChanges.subscribe((data) => {
      if (this.userLanguageInfo.pristine) {
        this.userLanguageInfoClone = AitAppUtils.deepCloneObject(data);
      } else {
        this.checkAllowSave();
      }
    });

    if (this.user_id != this.authService.getUserID()) {
      this.mode = MODE.VIEW;
      for (const index in this.resetUserLangInfo) {
        this.resetUserLangInfo[index] = true;
      }
    }
  }

  checkAllowSave() {
    const userInfo = { ...this.userLanguageInfo.value };
    const userInfoClone = { ...this.userLanguageInfoClone };

    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !isChangedUserInfo;
  }

  saveData() {
    const saveData = this.userLanguageInfo.value;

    this.userLanguageInfo.value.language = this.userLanguageInfo.value.language._key;
    if (this.userLanguageInfo.value.proficiency) {
      this.userLanguageInfo.value.proficiency = this.userLanguageInfo.value.proficiency._key;
    } else {
      this.userLanguageInfo.value.proficiency = '';
    }

    if (this.user_key) {
      saveData['_key'] = this.user_key;
    } else {
      saveData['user_id'] = this.authService.getUserID();
    }
    return saveData;
  }

  saveAndContinue() {
    this.isChanged = false;
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (this.userLanguageInfo.valid) {
      this.callLoadingApp();
      this.userLangService
        .save(this.saveData())
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.userLanguageInfo.reset();
            this.isSave = true;
            this.cancelLoadingApp();
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      this.scrollIntoError();
    }
  }

  saveAndClose() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (this.userLanguageInfo.valid) {
      this.callLoadingApp();
      this.userLangService
        .save(this.saveData())
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.cancelLoadingApp();
            this.closeDialog(true);
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.userLanguageInfo.controls)) {
      if (this.userLanguageInfo.controls[key].invalid) {
        const invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
        try {
          invalidControl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          });
          break;
        } catch { }
      }
    }
  }

  resetForm() {
    this.isChanged = false;
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserLangInfo) {
        this.resetUserLangInfo[index] = true;
        setTimeout(() => {
          this.resetUserLangInfo[index] = false;
        }, 100);
      }
      this.userLanguageInfo.reset();
    } else {
      for (const index in this.resetUserLangInfo) {
        if (!this.userLanguageInfo.controls[index].value) {
          this.resetUserLangInfo[index] = true;
          setTimeout(() => {
            this.resetUserLangInfo[index] = false;
          }, 100);
        }
      }
      this.userLanguageInfo.patchValue({
        ...this.userLanguageInfoClone,
      });
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  onDelete() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.callLoadingApp();
          const _key = [{ _key: this.user_key }];
          if (this.user_key) {
            await this.userLangService.remove(_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                this.cancelLoadingApp();
                this.closeDialog(true);
              } else {
                this.cancelLoadingApp();
                this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
              }
            });
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
          }
        }
      });
  }

  back() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            style: {width: '90%'},
            title: this.getMsg('I0006'),
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            this.closeDialog(false);
          }
        });
    } else {
      if(this.isSave){
        this.closeDialog(true);
      }else{
        this.closeDialog(false);
      }
    }
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userLanguageInfo.controls[target].markAsDirty();
      this.userLanguageInfo.controls[target].setValue(value?.value[0]);
    } else {
      this.userLanguageInfo.controls[target].setValue(null);
    }
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT
      ? this.translateService.translate('Edit language')
      : this.translateService.translate('Add language');
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
