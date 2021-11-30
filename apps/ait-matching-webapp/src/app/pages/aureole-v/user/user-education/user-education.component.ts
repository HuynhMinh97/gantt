// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserEducationService } from './../../../../services/user-education.service';
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
import { select, Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  getSettingLangTime,
  MODE,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { MatchingUtils } from '../../../../../app/@constants/utils/matching-utils';
import { UserSkillsService } from '../../../../services/user-skills.service';

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
  isLoad = false;
  isSave = false;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  isResetFile = false;
  isDateCompare = false;

  dateFormat = '';
  listFile = [];
  maxFile = 0;
  sizeFile = 0;
  titlFile = '';

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
    private userSkillsService: UserSkillsService,
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

    this.store.pipe(select(getSettingLangTime)).subscribe(setting => {
      if (setting) {
        const display = setting?.date_format_display;
        this.dateFormat= MatchingUtils.getFormatYearMonth(display);
      }
    });

    this.setModulePage({
      module: 'user',
      page: 'user_education',
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });

    this.userEducationInfo = this.formBuilder.group({
      school: new FormControl(null, [Validators.required]),
      degree: new FormControl(null),
      grade: new FormControl(null),
      field_of_study: new FormControl(null),
      start_date_from: new FormControl(this.defaultValueDate),
      start_date_to: new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null),
    });  
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.isLoad = true;
    },500);
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    this.getMaxFile();
    if (this.user_key) {
      this.callLoadingApp();
      await this.userEduService
        .findUserEducationByKey(this.user_key)
        .then(async (r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            const data = r.data[0];
            if (r.data.length > 0 && !data.del_flag) {
              this.userEducationInfo.patchValue({ ...data });
              this.userEducationInfoClone = this.userEducationInfo.value;
              this.listFile = this.userEducationInfo.value.file;
              this.user_id = data.user_id;
              isUserExist = true;
            }
            this.cancelLoadingApp();
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

  async getMaxFile(){
    await this.userSkillsService.getMaxSkill({value: ['maxSizeFile']})
    .then((res) => {
      this.sizeFile = parseInt(res.data[0].name);
    })
    await this.userSkillsService.getMaxSkill({value: ['maxFile']})
    .then((res) => {
      this.maxFile = parseInt(res.data[0].name);
      this.titlFile = this.translateService.translate('upload max 5 files')
        .replace('{0}', this.maxFile.toString())
        .replace('{1}', this.sizeFile.toString());
    })
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
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.userEducationInfo.valid && !this.isDateCompare) {
      this.callLoadingApp();
      this.userEduService
        .save(this.saveData())
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.resetModeNew();
            this.cancelLoadingApp();
            this.isSave = true;
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
    if (this.userEducationInfo.valid && !this.isDateCompare) {
      this.callLoadingApp();
      this.userEduService
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
        } catch { }
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
          id:'delete-user-education',
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          const _key = [{ _key: this.user_key }];
          if (this.user_key) {
            await this.userEduService.remove(_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                this.closeDialog(true);
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
      this.userEducationInfo.patchValue({
        ...this.userEducationInfoClone,
      });
      this.listFile = this.userEducationInfo.value.file;
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  checkDatePicker() {    
    const res = [];
    const msg = this.getMsg('E0004');
    const dateFrom = this.userEducationInfo.controls['start_date_from'].value;
    const dateTo = this.userEducationInfo.controls['start_date_to'].value;
    this.isDateCompare = false;

    if (dateFrom == null && dateTo == null) {
      this.isDateCompare = false;
    } else {
      if (dateFrom > dateTo  && dateTo != null) {
        const transferMsg = (msg || '')
          .replace('{0}', this.translateService.translate('date from'))
          .replace('{1}', this.translateService.translate('date to'));
        res.push(transferMsg);
        this.isDateCompare = true;
      }
      if(!dateFrom && dateTo){
        const transferMsg = (this.getMsg('E0020') || '')
        .replace('{0}', this.translateService.translate('date from'));
        res.push(transferMsg);
        this.isDateCompare = true;
      }
      
    }
    return res;
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
            id:'back-user-education',
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

  getTitleByMode() {
    return this.mode === MODE.EDIT
      ? this.translateService.translate('Edit education')
      : this.translateService.translate('Add education');
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
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
    this.errorArr = this.checkDatePicker();
  }

  takeFiles(fileList: any[]) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.userEducationInfo.markAsDirty();
      this.userEducationInfo.controls['file'].setValue(data);
    } else {
      this.userEducationInfo.markAsDirty();
      this.userEducationInfo.controls['file'].setValue(null);
    }
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }

}
