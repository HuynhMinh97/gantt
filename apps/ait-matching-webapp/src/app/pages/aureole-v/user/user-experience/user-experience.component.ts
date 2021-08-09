import { title } from 'node:process';
import { isValue } from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
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
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';

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
  stateUserExpInfoDf = {} as UserExperienceDto;
  userExperienceInfoClone: any;

  userExperienceInfoErros = new UserExpInfoErrorsMessage();

  infoLabelList = {} as KeyValueDto;

  // Form status change subscribe
  private userExperienceInfoSubscr: Subscription;

  mode = MODE.EDIT;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isDataInit = false;
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

  location: any = null;
  titleName: any = null;
  locationName: any = null;
  employee_typeName: any = null;
  company_workingName: any = null;
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
      page: PAGES.JOB_EDIT
    });

    //Create form builder group
    this.prepareForm();

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode === MODE.NEW) {
      this.userExperienceInfo.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
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
      employee_type: new FormControl(null, [Validators.required]),
      is_working: new FormControl(null),
      start_date_from: new Date(),
      start_date_to: new FormControl(null),
      description: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();

    // Run when form value change and only in edit mode
    this.userExperienceInfo.valueChanges.subscribe((data) => {
      if (this.userExperienceInfo.pristine) {
        this.userExperienceInfoClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    //check mode
    if (this.user_key) {
      const condition = { _key: this.user_key };
      const resInfo = await this.userExpService.findUserExperienceByKey(
        condition
      );
      let isUserExist = false;
      if (resInfo.data.length > 0) {
        const data = resInfo.data[0];
        console.log(resInfo);
        this.userExperienceInfo.patchValue({...data});
        isUserExist = true;
      }
      !isUserExist && this.router.navigate([`/404`]);
    }
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT ? '求人要件更新' : '求人要件登録';
  }

  async getUserExperienceInfo() {
    const id: any = AitAppUtils.getParamsOnUrl(true);
    if (id === 'user_experience') {
      this.mode = MODE.NEW;
    }
    if (this.mode === MODE.EDIT) {
      // this.setupButton();
      this.callLoadingApp();
      // const _key: any = AitAppUtils.getParamsOnUrl(true);
      const condition = { _key: AitAppUtils.getParamsOnUrl(true) };
      // await this.userExpService.findUserExperienceByKey(condition).then((r) => {
      //   if (r.status === RESULT_STATUS.OK) {
      //     console.log(r.data[0]);
      //   }
      // });
    }
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
    await this.userExpService.remove(this.user_key).then((res) => {
      console.log(res);
      if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
        this.showToastr('', this.getMsg('情報削除が成功しました。'));
        this.router.navigate([`/recommenced-user`]);
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    });
  }

  //Get all form error messages
  getErrors() {
    this.userExperienceInfoErros = new UserExpInfoErrorsMessage();
    this.userExperienceInfoErros = this.getFormErrorMessage(
      this.userExperienceInfo,
      this.infoLabelList
    );
  }

  getErrorKey(group: string, key: string) {
    if (key === 'residence_status') {
      return (
        key +
        '_' +
        group
          .split(/(?=[A-Z])/)
          .join()
          .toLowerCase()
          .replace(/,/g, '_')
      );
    } else {
      return key;
    }
  }

  scrollIntoError() {
    const group = this.userExperienceInfo as FormGroup;
    let isFocus = false;
    for (const key of Object.keys(group.controls)) {
      if (group.controls[key].invalid) {
        const errorKey = this.getErrorKey('userExperienceInfo', key);
        const invalidControl = this.element.nativeElement.querySelector(
          `#${errorKey}_input`
        );
        try {
          this.isOpen['userExperienceInfo'] = true;
          invalidControl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          });
          isFocus = true;
          break;
        } catch {
          console.error('scroll into error failed!!!');
        }
      }
    }
  }

  saveAndContinue() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    const saveData = this.userExperienceInfo.value;
    if (this.userExperienceInfo.valid) {
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
      this.scrollIntoError();

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
    //this.userExpService.save(this.userExperienceInfo.value);
    console.log(this.userExperienceInfo.value);
  }

  toggleCheckBox(checked: boolean) {
    this.userExperienceInfo.controls['is_working'].setValue(checked);
  }

  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }

  takeMasterValue(value: any, target: string): void {
    if (target === 'title' && isObjectFull(value.value)) {
      this.userExperienceInfo.controls['title'].setValue(value?.value[0]._key);
      this.titleName = {
        _key: value?.value[0]._key,
        value: value?.value[0].value,
      };
    } else if (target === 'company_working' && isObjectFull(value.value)) {
      this.userExperienceInfo.controls['company_working'].setValue(
        value?.value[0]._key
      );
      this.company_workingName = {
        _key: value?.value[0]._key,
        value: value?.value[0].value,
      };
    } else if (target === 'location' && isObjectFull(value.value)) {
      this.userExperienceInfo.controls['location'].setValue(
        value?.value[0]._key
      );
      this.locationName = {
        _key: value?.value[0]._key,
        value: value?.value[0].value,
      };
    } else if (target === 'employee_type' && isObjectFull(value.value)) {
      this.userExperienceInfo.controls['employee_type'].setValue(
        value?.value[0]._key
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

  getValue(value, target) {
    this.userExperienceInfo.controls[target].setValue(value);
  }

  checkAllowSave() {
    const userInfo = { ...this.userExperienceInfo.value };
    const userInfoClone = { ...this.userExperienceInfoClone };

    this.setHours(userInfo);

    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !isChangedUserInfo;
  }

  setHours(data: any) {
    for (const prop in data) {
      if (this.dateField.includes(prop)) {
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
      }
    }
  }

  ngOnDestroy() {
    this.userExperienceInfoSubscr.unsubscribe;
  }
}
