import {
  isArrayFull,
  isObjectFull,
} from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserLanguageService } from './../../../../services/user-language.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
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
import { KEYS, RESULT_STATUS } from '@ait/shared';

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
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;

  resetUserLangInfo = {
    language: false,
    proficiency: false,
  };

  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private navigation: AitNavigationService,
    private translatePipe: AitTranslationService,
    private userLangService: UserLanguageService,
    private translateService: AitTranslationService,
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
      module: MODULES.JOB,
      page: PAGES.JOB_EDIT,
    });

    this.userLanguageInfo = this.formBuilder.group({
      language: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      proficiency: new FormControl(null),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }
  async ngOnInit(): Promise<void> {
    if (this.user_key) {
      await this.userLangService
        .findUserLanguageByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            if (r.data.length > 0) {
              const data = r.data[0];
              console.log(data);

              this.userLanguageInfo.patchValue({ ...data });
              this.userLanguageInfoClone = this.userLanguageInfo.value;
              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
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
    saveData['user_id'] = this.authService.getUserID();
    this.userLanguageInfo.value.language = this.userLanguageInfo.value.language._key;
    if (this.userLanguageInfo.value.proficiency) {
      this.userLanguageInfo.value.proficiency = this.userLanguageInfo.value.proficiency._key;
    } else {
      this.userLanguageInfo.value.proficiency = '';
    }

    if (this.user_key) {
      saveData['_key'] = this.user_key;
    }
    return saveData;
  }

  saveAndContinue() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (this.userLanguageInfo.valid) {
      this.userLangService
        .save(this.saveData())
        .then((res) => {
          console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.userLanguageInfo.reset();
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
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
      this.userLangService
        .save(this.saveData())
        .then((res) => {
          console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            history.back();
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
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
        } catch {}
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
          const _key = [{ _key: this.user_key }];
          if (this.user_key) {
            await this.userLangService.remove(_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                history.back();
              } else {
                this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
              }
            });
          } else {
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
            title: this.getMsg('I0006'),
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            history.back();
          }
        });
    } else {
      history.back();
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
    return this.mode === MODE.EDIT ? 'Edit language' : 'Add language';
  }
}
