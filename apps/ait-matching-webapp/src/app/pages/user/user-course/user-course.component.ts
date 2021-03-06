// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  MODE,
  AppState,
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AitConfirmDialogComponent,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogService,
  NbDialogRef,
} from '@nebular/theme';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import kanjidate from 'kanjidate';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { UserCourseService } from '../../../../../../../apps/ait-matching-webapp/src/app/services/user-course.service';
import { UserSkillsService } from '../../../services/user-skills.service';

@Component({
  selector: 'ait-user-course',
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.scss'],
})
export class UserCourseComponent extends AitBaseComponent implements OnInit {
  mode = MODE.NEW;
  courseClone: any;
  course: FormGroup;
  defaultValue: any;
  dateNow = new Date().setHours(0, 0, 0, 0);

  dateFormat = '';
  course_key = '';
  selectFile = '';
  maxFile = 0;
  sizeFile = 0;
  titlFile = '';

  error = [];
  companyCenter = [];
  listFile = [];

  isLoad = false;
  isSave = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  isReadonly = false;
  submitFile = false;
  isResetFile = false;
  isClearErrors = false;
  resetMasterUser = false;

  resetCourse = {
    _key: false,
    file: false,
    name: false,
    is_online: false,
    description: false,
    course_number: false,
    start_date_to: false,
    start_date_from: false,
    training_center: false,
  };

  constructor(
    router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    public userCourseService: UserCourseService,
    private userSkillsService: UserSkillsService,
    private translateService: AitTranslationService,
    // private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
    authService: AitAuthService,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService,
      null,
      router
    );
    this.user_id = this.authService.getUserID();
    this.setModulePage({
      module: 'user',
      page: 'user_course',
    });
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.course_key = this.activeRouter.snapshot.paramMap.get('id');

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //       this.closeDialog(false);
    //   }
    // });

    this.course = this.formBuilder.group({
      _key: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      course_number: new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null, [Validators.maxLength(5)]),
      is_online: new FormControl(null),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      training_center: new FormControl(null),
      user_id: new FormControl(null),
    });
  }
  // get value form
  async ngOnInit(): Promise<any> {
    this.getMaxFile();
    setTimeout(() => {
      this.isLoad = true;
    }, 500);
    if (this.course_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode == MODE.NEW) {
      this.callLoadingApp();
      this.course.controls['start_date_from'].setValue(this.dateNow);
      this.courseClone = this.course.value;
      this.cancelLoadingApp();
    } else {
      await this.find(this.course_key);
    }
    await this.course.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });

    if (this.course.value.start_date_from == null && this.mode == 'NEW') {
      this.course.controls['start_date_from'].setValue(this.dateNow);
    }
  }
  checkAllowSave() {
    const courseInfo = { ...this.course.value };
    const courseClone = { ...this.courseClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...courseInfo },
      { ...courseClone }
    );
    this.isChanged = !isChangedUserInfo;
  }
  async getMaxFile() {
    await this.userSkillsService
      .getMaxSkill({ value: ['maxSizeFile'] })
      .then((res) => {
        this.sizeFile = parseInt(res.data[0].name);
      });
    await this.userSkillsService
      .getMaxSkill({ value: ['maxFile'] })
      .then((res) => {
        this.maxFile = parseInt(res.data[0].name);
        this.titlFile = this.translateService
          .translate('upload max 5 files')
          .replace('{0}', this.maxFile.toString())
          .replace('{1}', this.sizeFile.toString());
      });
  }
  takeMasterValue(val: any, form: string): void {
    if (isObjectFull(val) && val.value.length > 0) {
      this.course.controls[form].markAsDirty();
      this.course.controls[form].setValue(val?.value[0]);
    } else {
      this.course.controls[form].markAsDirty();
      this.course.controls[form].setValue(null);
    }
  }
  takeInputValue(val: any, form: string): void {
    if (val) {
      this.course.controls[form].markAsDirty();
      this.course.controls[form].setValue(val);
    } else {
      this.course.controls[form].markAsDirty();
      this.course.controls[form].setValue(null);
    }
  }
  // is_online
  toggleCheckBox(checked: boolean) {
    this.course.markAsDirty();
    this.course.controls['is_online'].setValue(checked);
  }
  //date
  setKanjiDate() {
    const dob_jp = kanjidate.format(
      kanjidate.f2,
      new Date(this.course.controls['dob'].value)
    );
    this.course.controls['dob_jp'].setValue(dob_jp);
  }
  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
      // set jp_dob format japan cadidates
      form === 'dob' && this.setKanjiDate();
    } else {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
      // form === 'dob' && this.course.controls['dob_jp'].setValue(null);
    }
    this.error = this.checkDatePicker();
  }

  checkDatePicker() {
    const res = [];
    const msg = this.getMsg('E0004');
    const dateFrom = this.course.controls['start_date_from'].value;
    const dateTo = this.course.controls['start_date_to'].value;
    if (dateFrom > dateTo && dateTo != null) {
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('date from'))
        .replace('{1}', this.translateService.translate('date to'));
      res.push(transferMsg);
    }
    if (!dateFrom && dateTo) {
      const transferMsg = (this.getMsg('E0020') || '').replace(
        '{0}',
        this.translateService.translate('date from')
      );
      res.push(transferMsg);
    }
    return res;
  }
  // file
  getFiles(fileList: any[]) {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((fileList) => {
        data.push(fileList._key);
      });
      this.course.markAsDirty();
      this.course.controls['file'].setValue(data);
    } else {
      this.course.markAsDirty();
      this.course.controls['file'].setValue(null);
    }
  }
  //end file
  async reset() {
    this.isSubmit = false;
    this.submitFile = false;
    this.isChanged = false;
    this.error = [];
    this.companyCenter = null;
    this.course.reset();
    this.isResetFile = true;
    setTimeout(() => {
      this.isResetFile = false;
    }, 100);
    for (const prop in this.resetCourse) {
      this.resetCourse[prop] = true;
      setTimeout(() => {
        this.resetCourse[prop] = false;
      }, 10);
    }
  }

  async resetForm() {
    if (this.mode === MODE.NEW) {
      await this.reset();
      setTimeout(() => {
        this.course.controls['start_date_from'].setValue(this.dateNow);
        this.showToastr('', this.getMsg('I0007'));
      }, 100);
    } else {
      this.isResetFile = true;
      setTimeout(() => {
        this.isResetFile = false;
      }, 100);
      this.error = [];
      this.isClearErrors = true;
      setTimeout(() => {
        this.isClearErrors = false;
      }, 100);
      this.companyCenter = [];
      this.companyCenter.push({
        _key: this.courseClone.training_center?._key,
        value: this.courseClone.training_center?.value,
      });
      this.course.patchValue({ ...this.courseClone });
      this.listFile = this.course.value.file;
      this.showToastr('', this.getMsg('I0007'));
    }
  }

  async saveAndContinue() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    const saveData = this.course.value;
    saveData.training_center = saveData.training_center
      ? saveData.training_center._key
      : null;
    saveData['user_id'] = this.authService.getUserID();
    if (this.course.value.is_online == null) {
      saveData['is_online'] = false;
    }
    this.error.length;
    if (this.course.valid && this.error.length <= 0) {
      this.callLoadingApp();
      await this.userCourseService
        .saveCourse(saveData)
        .then(async (res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            await this.reset();
            setTimeout(() => {
              this.course.controls['start_date_from'].setValue(this.dateNow);
            }, 100);
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

  async saveAndClose() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    const saveData = this.course.value;
    saveData.training_center = saveData.training_center
      ? saveData.training_center._key
      : null;
    saveData['user_id'] = this.authService.getUserID();
    if (this.course.value.is_online == null) {
      saveData['is_online'] == false;
    }
    if (this.course.valid && this.error.length <= 0) {
      this.callLoadingApp();
      await this.userCourseService
        .saveCourse(saveData)
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.closeDialog(true);
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

  scrollIntoError() {
    for (const key of Object.keys(this.course.controls)) {
      if (this.course.controls[key].invalid) {
        let invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
        if (key == 'file') {
          invalidControl = this.element.nativeElement.querySelector(
            `#${key}_input_file`
          );
        }
        try {
          invalidControl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          });
          break;
        } catch {}
      }
    }

    if (this.error.length > 0) {
      const invalidControl = this.element.nativeElement.querySelector(
        `.ng-star-inserted div`
      );
      try {
        invalidControl.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      } catch {}
    }
  }

  //delete
  async deleteUserById() {
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
          await this.userCourseService.deleteCourseByKey(this.courseClone._key);
          setTimeout(() => {
            this.showToastr('', this.getMsg('I0003'));
            this.closeDialog(true);
          }, 100);
        }
      });
  }
  //end delete
  closeDialog(event: boolean) {
    // this.nbDialogRef.close(event);
  }

  back() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            style: { width: '90%' },
            title: this.getMsg('I0006'),
            id: 'back-user-course',
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            this.closeDialog(false);
          }
        });
    } else {
      if (this.isSave) {
        this.closeDialog(true);
      } else {
        this.closeDialog(false);
      }
    }
  }

  getTitleByMode() {
    this.selectFile = this.translateService.translate('Select');
    let title = '';
    if (this.mode === MODE.EDIT) {
      title = this.translateService.translate('edit course');
    }
    if (this.mode === MODE.NEW) {
      title = this.translateService.translate('add course');
    }
    return title;
  }

  public save = async (data = {}) => {
    try {
      data['user_id'] = this.user_id;
      return await this.userCourseService.saveCourse(data).then(async (res) => {
        if (res?.status === RESULT_STATUS.OK) {
          return res;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  async find(key: string) {
    if (this.course_key) {
      this.callLoadingApp();
      await this.userCourseService.findCourseByKey(key).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          if (r.data.length > 0) {
            const data = r.data[0];
            this.course.patchValue({ ...data });
            this.courseClone = this.course.value;
            this.companyCenter = [
              { _key: data.training_center?._key },
              { value: data.training_center?.value },
            ];
            this.listFile = this.course.value.file;
            if (this.user_id != data.user_id) {
              this.mode = MODE.VIEW;
              this.isReadonly = true;
            }
            this.cancelLoadingApp();
          } else {
            this.cancelLoadingApp();
            this.router.navigate([`/404`]);
          }
        }
      });
    }
    return;
  }
}
