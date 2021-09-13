import {
  isArrayFull,
  isObjectFull,
} from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserEducationService } from './../../../../services/user-education.service';
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
  AitTranslationService,
  AppState,
  MODE,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { KEYS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.scss'],
})
export class UserEducationComponent extends AitBaseComponent implements OnInit {
  // Create form group
  userEducationInfo: FormGroup;
  userEducationInfoClone: any;
  defaultValueDate = new Date().setHours(0, 0, 0, 0);

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  isResetFile = false;
  isDateCompare = false;

  resetUserInfo = {
    file: false,
    grade: false,
    school: false,
    degree: false,
    start_date_to: false,
    field_of_study: false,
    description: false,
    start_date_from: false,
  };

  user_key = '';
  user_id = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userEduService: UserEducationService,
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
      module: 'user',
      page: 'user_education',
    });

    this.userEducationInfo = this.formBuilder.group({
      school: new FormControl(null, [Validators.required]),
      degree: new FormControl(null),
      grade: new FormControl(null),
      field_of_study: new FormControl(null),
      file: new FormControl(null),
      start_date_from: new FormControl(this.defaultValueDate),
      start_date_to: new FormControl(null),
      description: new FormControl(null),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.user_key) {
      await this.userEduService
        .findUserEducationByKey(this.user_key)
        .then(async (r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            const data = r.data[0];
            if (r.data.length > 0 && !data.del_flag) {
              this.userEducationInfo.patchValue({ ...data });
              this.userEducationInfoClone = this.userEducationInfo.value;
              this.user_id = data.user_id;
              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }

    // Run when form value change
    await this.userEducationInfo.valueChanges.subscribe((data) => {
      if (this.userEducationInfo.pristine) {
        this.userEducationInfoClone = AitAppUtils.deepCloneObject(data);
      } else {
        this.checkAllowSave();
      }
    });

    if (this.user_id != this.authService.getUserID()) {
      this.mode = MODE.VIEW;
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
      }
    }
  }

  checkAllowSave() {
    const userInfo = { ...this.userEducationInfo.value };
    const userInfoClone = { ...this.userEducationInfoClone };

    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
  }

  saveData() {
    const saveData = this.userEducationInfo.value;

    saveData.school = saveData.school._key;
    if (this.user_key) {
      saveData['_key'] = this.user_key;
    } else {
      saveData['user_id'] = this.authService.getUserID();
    }
    return saveData;
  }

  saveAndContinue() {
    this.errorArr = this.checkDatePicker();
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.userEducationInfo.valid && !this.isDateCompare) {
      this.userEduService
        .save(this.saveData())
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.resetModeNew();
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
    this.errorArr = this.checkDatePicker();

    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.userEducationInfo.valid && !this.isDateCompare) {
      this.userEduService
        .save(this.saveData())
        .then((res) => {
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
    for (const key of Object.keys(this.userEducationInfo.controls)) {
      if (this.userEducationInfo.controls[key].invalid) {
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
            await this.userEduService.remove(_key).then((res) => {
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

  resetModeNew() {
    this.isChanged = false;
    this.isResetFile = true;
    setTimeout(() => {
      this.isResetFile = false;
    }, 100);
    for (const index in this.resetUserInfo) {
      this.resetUserInfo[index] = true;
      setTimeout(() => {
        this.resetUserInfo[index] = false;
      }, 100);
    }
    this.userEducationInfo.reset();
    setTimeout(() => {
      this.userEducationInfo.controls['start_date_from'].setValue(
        this.defaultValueDate
      );
    }, 100);
  }

  resetForm() {
    this.errorArr = [];
    this.isResetFile = true;
    setTimeout(() => {
      this.isResetFile = false;
    }, 100);
    if (this.mode === MODE.NEW) {
      this.resetModeNew();
    } else {
      for (const index in this.resetUserInfo) {
        if (!this.userEducationInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
      console.log(this.userEducationInfoClone);
      
      this.userEducationInfo.patchValue({
        ...this.userEducationInfoClone,
      });
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  checkDatePicker() {
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.userEducationInfo.controls['start_date_from'].value;
    const dateTo = this.userEducationInfo.controls['start_date_to'].value;

    if (dateFrom == null || dateTo == null) {
      this.isDateCompare = false;
    } else {
      if (dateFrom > dateTo) {
        const transferMsg = (msg || '')
          .replace('{0}', this.translateService.translate('start_date_from'))
          .replace('{1}', this.translateService.translate('start_date_to'));
        res.push(transferMsg);
        this.isDateCompare = true;
      }
    }
    return res;
  }
  s;

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

  getTitleByMode() {
    return this.mode === MODE.EDIT
      ? this.translateService.translate('edit_education')
      : this.translateService.translate('add_education');
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userEducationInfo.controls[target].markAsDirty();
      this.userEducationInfo.controls[target].setValue(value?.value[0]);
    } else {
      this.userEducationInfo.controls[target].setValue(null);
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userEducationInfo.controls[form].markAsDirty();
      this.userEducationInfo.controls[form].setValue(value);
    } else {
      this.userEducationInfo.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value == null) {
      this.isChanged = true;
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
  }

  takeFiles(fileList: any[], group: string, form: string) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userEducationInfo.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this.userEducationInfo.markAsDirty();
      this[group].controls[form].setValue(null);
    }
  }

  ngOnDestroy() {}
}
