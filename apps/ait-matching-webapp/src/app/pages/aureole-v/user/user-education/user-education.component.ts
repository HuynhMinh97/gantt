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
  AitNavigationService,
  AitTranslationService,
  AppState,
  MODE,
  MODULES,
  PAGES,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { KEYS, RESULT_STATUS } from '@ait/shared';
import { UserEducationDto } from './interface';

@Component({
  selector: 'ait-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.scss'],
})
export class UserEducationComponent extends AitBaseComponent implements OnInit {
  // Create form group
  userEducationInfo: FormGroup;
  userEducationInfoClone: any;
  defaultValueDate: Date = new Date();

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  isResetFile = false;
  isDateCompare = false;
  isInValidTitle = false;
  isInValidCompany = false;
  isInValidLocation = false;

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

  dateField = ['start_date_from', 'start_date_to'];
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
      module: MODULES.JOB,
      page: PAGES.JOB_EDIT,
    });

    this.userEducationInfo = this.formBuilder.group({
      school: new FormControl(null, [Validators.required]),
      degree: new FormControl(null),
      grade: new FormControl(null),
      field_of_study: new FormControl(null),
      file: new FormControl(null),
      start_date_from: this.defaultValueDate.getTime(),
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
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            if (r.data.length > 0) {
              const data = r.data[0];
              this.userEducationInfo.patchValue({ ...data });
              this.userEducationInfo.controls['file'].setValue([...data.file]);
              this.userEducationInfoClone = this.userEducationInfo.value;
              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }
    // Run when form value change and only in edit mode
    this.userEducationInfo.valueChanges.subscribe((data) => {
      if (this.userEducationInfo.pristine) {
        this.userEducationInfoClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });
  }

  checkAllowSave() {
    const userInfo = { ...this.userEducationInfo.value };
    const userInfoClone = { ...this.userEducationInfoClone };

    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !isChangedUserInfo;
  }

  saveData() {
    const saveData = this.userEducationInfo.value;
    saveData['user_id'] = this.authService.getUserID();
    this.userEducationInfo.value.school = this.userEducationInfo.value.school._key;

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

    if (this.userEducationInfo.valid && !this.isDateCompare) {
      this.userEduService
        .save(this.saveData())
        .then((res) => {
          //console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.userEducationInfo.reset();
            this.userEducationInfo.controls['start_date_from'].setValue(
              this.defaultValueDate.getTime()
            );
            this.isResetFile = true;
            setTimeout(() => {
              this.isResetFile = false;
            }, 100);
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
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

  resetForm() {
    this.errorArr = [];
    this.isResetFile = true;
    setTimeout(() => {
      this.isResetFile = false;      
    }, 100);
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userEducationInfo.reset();
      this.userEducationInfo.controls['start_date_from'].setValue(
        this.defaultValueDate.getTime()
      );
    } else {
      for (const index in this.resetUserInfo) {
        if (!this.userEducationInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
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

    if (dateFrom > dateTo) {
      const transferMsg = (msg || '')
        .replace('{0}', ' start_date_from ')
        .replace('{1}', ' start_date_to ');
      res.push(transferMsg);
      this.isDateCompare = true;
    } else {
      this.isDateCompare = false;
    }
    return res;
  }

  back() {
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
          //this.navigation.back();
          history.back();
        }
      });
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT ? 'Edit education' : 'Add education';
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

  ngOnDestroy(){
    
  }
}
