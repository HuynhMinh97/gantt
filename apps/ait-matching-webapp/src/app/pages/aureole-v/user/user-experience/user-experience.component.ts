import { isObjectFull } from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserExperienceService } from './../../../../services/user-experience.service';
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
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.scss'],
})
export class UserExperienceComponent
  extends AitBaseComponent
  implements OnInit {
  // Create form group
  userExperienceInfo: FormGroup;
  userExperienceInfoClone: any;

  defaultCompany = {} as KeyValueDto;
  defaultValueDate = new Date().setHours(0, 0, 0, 0);

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isDateCompare = false;

  resetUserInfo = {
    title: false,
    location: false,
    is_working: false,
    description: false,
    employee_type: false,
    start_date_to: false,
    company_working: false,
    start_date_from: false,
  };

  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userExpService: UserExperienceService,
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
      page: 'user_experience',
    });

    //Create form builder group
    this.userExpService
      .findUserProfile(this.authService.getUserID())
      .then((x) => {
        this.defaultCompany = {
          _key: x.data[0].company_working._key,
          value: x.data[0].company_working.value,
        };

        this.userExperienceInfo.controls['company_working'].setValue({
          ...this.defaultCompany,
        });
      });

    this.userExperienceInfo = this.formBuilder.group({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      company_working: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      employee_type: new FormControl(null, [Validators.required]),
      is_working: new FormControl(false),
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
      await this.userExpService
        .findUserExperienceByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            if (r.data.length > 0) {
              const data = r.data[0];
              this.userExperienceInfo.patchValue({ ...data });
              this.userExperienceInfoClone = this.userExperienceInfo.value;
              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }

    // Run when form value change
    await this.userExperienceInfo.valueChanges.subscribe((data) => {
      if (this.userExperienceInfo.pristine) {
        this.userExperienceInfoClone = AitAppUtils.deepCloneObject(data);
      } else {
        this.checkAllowSave();
      }
    });
  }

  checkAllowSave() {
    const userInfo = { ...this.userExperienceInfo.value };
    const userInfoClone = { ...this.userExperienceInfoClone };

    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
  }
  
  getTitleByMode() {
    return this.mode === MODE.EDIT
      ? this.translateService.translate('edit_experience')
      : this.translateService.translate('add_experience');
  }

  resetForm() {
    this.errorArr = [];
    this.isChanged = false;
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userExperienceInfo.reset();
      setTimeout(() => {
        this.userExperienceInfo.controls['start_date_from'].setValue(
          this.defaultValueDate
        );
        this.userExperienceInfo.controls['company_working'].setValue({
          ...this.defaultCompany,
        });
      }, 100);
    } else {
      for (const index in this.resetUserInfo) {
        if (!this.userExperienceInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
      this.userExperienceInfo.patchValue({
        ...this.userExperienceInfoClone,
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
            await this.userExpService.remove(_key).then((res) => {
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

  saveData() {
    const saveData = this.userExperienceInfo.value;
    saveData['user_id'] = this.authService.getUserID();
    saveData.title = saveData.title._key;
    saveData.location = saveData.location._key;
    saveData.employee_type = saveData.employee_type._key;
    saveData.company_working = saveData.company_working._key;

    if (saveData.is_working) {
      this.userExperienceInfo.controls['start_date_to'].setValue(null);
    }
    if (this.user_key) {
      saveData['_key'] = this.user_key;
    }
    return saveData;
  }

  saveAndContinue() {
    this.errorArr = this.checkDatePicker();

    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (this.userExperienceInfo.valid && !this.isDateCompare) {
      this.userExpService
        .save(this.saveData())
        .then((res) => {
          //console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.userExperienceInfo.reset();
            this.userExperienceInfo.controls['start_date_from'].setValue(
              this.defaultValueDate
            );
            this.userExperienceInfo.controls['company_working'].setValue({
              ...this.defaultCompany,
            });
            this.userExperienceInfo.controls['is_working'].setValue(false);
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

    if (this.userExperienceInfo.valid && !this.isDateCompare) {
      this.userExpService
        .save(this.saveData())
        .then((res) => {
          //console.log(res);
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
    for (const key of Object.keys(this.userExperienceInfo.controls)) {
      if (this.userExperienceInfo.controls[key].invalid) {
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

  toggleCheckBox(checked: boolean) {
    this.userExperienceInfo.controls['is_working'].setValue(checked);
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userExperienceInfo.controls[target].markAsDirty();
      this.userExperienceInfo.controls[target].setValue(value?.value[0]);
    } else {
      this.userExperienceInfo.controls[target].setValue(null);
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userExperienceInfo.controls[form].markAsDirty();
      this.userExperienceInfo.controls[form].setValue(value);
    } else {
      this.userExperienceInfo.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      //this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
  }

  checkDatePicker() {
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.userExperienceInfo.controls['start_date_from'].value;
    const dateTo = this.userExperienceInfo.controls['start_date_to'].value;
    const isWorking = this.userExperienceInfo.controls['is_working'].value;
    if (dateFrom > dateTo && !isWorking) {
      const transferMsg = (msg || '')
        .replace('{0}', ' start_date_from ')
        .replace('{1}', ' start_date_to ');
      res.push(transferMsg);
      this.isDateCompare = true;
    } else if (dateFrom > this.defaultValueDate && isWorking) {
      const transferMsg = (msg || '')
        .replace('{0}', ' start_date_from ')
        .replace('{1}', ' now_date ');
      res.push(transferMsg);
      this.isDateCompare = true;
    } else {
      this.isDateCompare = false;
    }
    return res;
  }

  back() {
    console.log(this.isChanged);

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

  ngOnDestroy() {}
}
