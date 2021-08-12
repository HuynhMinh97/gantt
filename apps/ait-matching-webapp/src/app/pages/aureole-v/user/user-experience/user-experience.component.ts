import { title } from 'node:process';
import {
  isValue,
  isObjectFull,
  isNumber,
} from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserExperienceDto, UserExpInfoErrorsMessage } from './../../interface';
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
import { select, Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  MODE,
  MODULES,
  PAGES,
} from '@ait/ui';
import {
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
} from '@nebular/theme';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { isArrayFull, KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';

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
  stateForm: any = {} as UserExperienceDto;
  stateUserExpInfo = {} as UserExperienceDto;
  stateUserExpInfoDf = {} as UserExperienceDto;
  userExperienceInfoClone: any;

  userExperienceInfoErros = new UserExpInfoErrorsMessage();

  infoLabelList = {} as KeyValueDto;

  // Form status change subscribe
  private userExperienceInfoSubscr: Subscription;

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isSubmit = false;
  isDateCompare = false;
  isChanged = false;
  isInValidTitle = false;
  isInValidCompany = false;
  isInValidLocation = false;

  resetUserInfo = {
    title: false,
    location: false,
    is_working: false,
    employee_type: false,
    company_working: false,
    start_date_from: false,
    start_date_to: false,
    description: false,
  };

  errors = {
    title: [],
    location: [],
    is_working: [],
    employee_type: [],
    company_working: [],
    start_date_from: [],
    start_date_to: [],
    description: [],
  };

  isOpen = {
    userExperienceInfo: true,
  };

  dateField = ['start_date_from', 'start_date_to'];
  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private translatePipe: AitTranslationService,
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
      module: MODULES.JOB,
      page: PAGES.JOB_EDIT,
    });

    //Create form builder group
    this.prepareForm();

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  prepareForm() {
    this.userExperienceInfo = this.formBuilder.group({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      company_working: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      employee_type: [null, Validators.required],
      is_working: new FormControl(null),
      start_date_from: new Date().getTime(),
      start_date_to: new FormControl(null),
      description: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();

    //check mode
    if (this.user_key) {
      const resInfo = await this.userExpService
        .findUserExperienceByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            if (r.data.length > 0) {
              const data = r.data[0];
              this.userExperienceInfo.patchValue({ ...data });

              this.userExperienceInfo.controls['title'].setValue({
                _key: data.title,
              });

              this.userExperienceInfo.controls['company_working'].setValue({
                _key: data.company_working,
              });

              this.userExperienceInfo.controls['location'].setValue({
                _key: data.location,
              });

              this.userExperienceInfo.controls['employee_type'].setValue({
                _key: data.employee_type,
              });

              this.userExperienceInfoClone = this.userExperienceInfo.value;

              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT ? '求人要件更新' : '求人要件登録';
  }

  setErrors = (newErrors: any) =>
    (this.errors = { ...this.errors, ...newErrors });

  clearErrors() {
    this.setErrors({
      title: [],
      company_working: [],
      location: [],
      employee_type: [],
      is_working: [],
      start_date_from: [],
      start_date_to: [],
      description: [],
    });
  }

  resetForm() {
    this.clearErrors();
    this.errorArr = [];
    if (this.mode === MODE.NEW) {
      this.prepareForm();
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userExperienceInfoSubscr.unsubscribe;
      this.userExperienceInfoErros = new UserExpInfoErrorsMessage();
    } else {
      this.userExperienceInfo.patchValue({
        ...this.userExperienceInfoClone,
      });
      for (const index in this.resetUserInfo) {
        if (!this.userExperienceInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  confirmBeforeDelete() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.onDelete();
        }
      });
  }

  async onDelete() {
    const _key = [{ _key: this.user_key }];
    if (this.user_key) {
      await this.userExpService.remove(_key).then((res) => {
        console.log(res);
        if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
          this.showToastr('', this.getMsg('情報削除が成功しました。'));
          this.router.navigate([`/recommenced-user`]);
        } else {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } else {
      this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
    }
  }

  //Get all form error messages
  getErrors() {
    this.userExperienceInfoErros = new UserExpInfoErrorsMessage();
    this.userExperienceInfoErros = this.getFormErrorMessage(
      this.userExperienceInfo,
      this.infoLabelList
    );
  }

  saveAndContinue() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    this.userExperienceInfo.value.title = this.userExperienceInfo.value.title._key;
    this.userExperienceInfo.value.location = this.userExperienceInfo.value.location._key;
    this.userExperienceInfo.value.employee_type = this.userExperienceInfo.value.employee_type._key;
    this.userExperienceInfo.value.company_working = this.userExperienceInfo.value.company_working._key;

    const saveData = this.userExperienceInfo.value;
    saveData['_key'] = this.user_key;
    this.errorArr = this.checkDatePicker();
    if (this.userExperienceInfo.valid && !this.isDateCompare) {
      this.userExpService
        .save(saveData)
        .then((res) => {
          console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.router.navigateByUrl('/user-experience');
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      // Form invalid, get all erros messages
      this.getErrors();

      // Subscribe form status for onchange event error message
      this.userExperienceInfoSubscr = this.userExperienceInfo.statusChanges.subscribe(
        (status) => {
          if (status === 'INVALID') {
            this.getErrors();
          }
        }
      );
    }
  }

  saveAndClose() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    this.userExperienceInfo.value.title = this.userExperienceInfo.value.title._key;
    this.userExperienceInfo.value.location = this.userExperienceInfo.value.location._key;
    this.userExperienceInfo.value.employee_type = this.userExperienceInfo.value.employee_type._key;
    this.userExperienceInfo.value.company_working = this.userExperienceInfo.value.company_working._key;

    const saveData = this.userExperienceInfo.value;
    saveData['_key'] = this.user_key;
    this.errorArr = this.checkDatePicker();
    if (this.userExperienceInfo.valid && !this.isDateCompare) {
      this.userExpService
        .save(saveData)
        .then((res) => {
          console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.router.navigate([`/recommenced-user`]);
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      // Form invalid, get all erros messages
      this.getErrors();

      // Subscribe form status for onchange event error message
      this.userExperienceInfoSubscr = this.userExperienceInfo.statusChanges.subscribe(
        (status) => {
          if (status === 'INVALID') {
            this.getErrors();
          }
        }
      );
    }
  }

  toggleCheckBox(checked: boolean) {
    this.userExperienceInfo.controls['is_working'].setValue(checked);
  }

  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }

  takeMasterValue(value: any, target: string): void {
    if (target === 'title' && isObjectFull(value)) {
      this.userExperienceInfo.controls['title'].setValue(value?.value[0]);
    } else if (target === 'company_working' && isObjectFull(value)) {
      this.userExperienceInfo.controls['company_working'].setValue(
        value?.value[0]
      );
    } else if (target === 'location' && isObjectFull(value)) {
      this.userExperienceInfo.controls['location'].setValue(value?.value[0]);
    } else if (target === 'employee_type' && isObjectFull(value)) {
      this.userExperienceInfo.controls['employee_type'].setValue(
        value?.value[0]
      );
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
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
  }

  getFieldName = (name: string) => this.translatePipe.translate(name || '');

  checkDatePicker() {
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.userExperienceInfo.controls['start_date_from'].value;
    const dateTo = this.userExperienceInfo.controls['start_date_to'].value;
    const isWorking = this.userExperienceInfo.controls['is_working'].value;
    const nowDate = new Date().getTime();
    if (dateFrom > dateTo && isWorking == false) {
      const transferMsg = (msg || '')
        .replace('{0}', this.getFieldName(' start_date_from '))
        .replace('{1}', this.getFieldName(' start_date_to '));
      res.push(transferMsg);
      this.isDateCompare = true;
    } else if (isWorking == true && dateFrom > nowDate) {
      const transferMsg = (msg || '')
        .replace('{0}', this.getFieldName(' start_date_from '))
        .replace('{1}', this.getFieldName(' now_date '));
      res.push(transferMsg);
      this.isDateCompare = true;
    } else {
      this.isDateCompare = false;
    }
    return res;
  }

  ngOnDestroy() {
    this.userExperienceInfoSubscr.unsubscribe;
  }
}
