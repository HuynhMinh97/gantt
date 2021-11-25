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
import kanjidate from 'kanjidate';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbLayoutScrollService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { UserCerfiticateService } from '../../../../services/user-certificate.service';


@Component({
  selector: 'ait-user-certificate',
  templateUrl: './user-certificate.component.html',
  styleUrls: ['./user-certificate.component.scss']
})
export class UserCertificateComponent extends AitBaseComponent implements OnInit {
  mode = MODE.NEW;
  certificateClone: any;
  certificate: FormGroup;
  dateNow = new Date().setHours(0, 0, 0, 0);

  files = [];
  error = [];
  companyName = [];
  companyIssue = [];

  isSave = false;
  isSubmit = false;
  isChanged = false;
  submitFile = false;
  isResetFile = false;
  isClearError = false;

  resetCertificate = {
    file: false,
    name: false,
    grade: false,
    issue_by: false,
    description: false,
    issue_date_to: false,
    issue_date_from: false,
    certificate_award_number: false,
  };
  dateFormat = '';
  selectFile = '';
  certificate_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    public cartificateService: UserCerfiticateService,
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
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
      toastrService
    );
    this.user_id = this.authService.getUserID();
    this.setModulePage({
      module: 'user',
      page: 'user_cerfiticate',
    });
    
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });

    this.certificate = this.formBuilder.group({
      _key: new FormControl(null),
      grade: new FormControl(null),
      user_id: new FormControl(null),
      issue_by: new FormControl(null),
      description: new FormControl(null),
      issue_date_to: new FormControl(null),
      issue_date_from: new FormControl(null),
      certificate_award_number: new FormControl(null),
      file: new FormControl(null, [Validators.maxLength(5)]),
      name: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
    });
  }
  async ngOnInit(): Promise<any> {
    if (this.certificate_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode == MODE.NEW) {
      this.callLoadingApp();
      this.certificate.controls['issue_date_from'].setValue(this.dateNow);
      this.certificateClone = this.certificate.value;
      setTimeout(() => {
        this.cancelLoadingApp();
      }, 500);
    } else {
      await this.find(this.certificate_key);
    }
    await this.certificate.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });
    if (this.certificate.value.issue_date_from == null && this.mode == 'NEW') {
      this.certificate.controls['issue_date_from'].setValue(this.dateNow);
    }
  }

  checkAllowSave() {
    const certificateInfo = { ...this.certificate.value };
    const certificateClone = { ...this.certificateClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...certificateInfo },
      { ...certificateClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }

  takeMasterValue(val: any, form: string): void {
    if (isObjectFull(val) && val.value.length > 0) {
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(val?.value[0]);
    } else {
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(null);
    }
  }

  takeInputValue(val: any, form: string): void {
    if (val) {
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(val);
    } else {
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(null);
    }
  }
  //date
  setKanjiDate() {
    const dob_jp = kanjidate.format(
      kanjidate.f2,
      new Date(this.certificate.controls['dob'].value)
    );
    this.certificate.controls['dob_jp'].setValue(dob_jp);
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value == null) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
      // set jp_dob format japan cadidates    
      form === 'dob' && this.setKanjiDate();
    }
    this.error = this.checkDatePicker();
  }

  checkDatePicker() {
    const res = [];
    const msg = this.getMsg('E0004');
    const dateFrom = this.certificate.controls['issue_date_from'].value;
    const dateTo = this.certificate.controls['issue_date_to'].value;
    if (dateFrom > dateTo  && dateTo != null) {
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('issue date'))
        .replace('{1}', this.translateService.translate('issue date to'));
      res.push(transferMsg);
    }
    if(!dateFrom && dateTo){
      const transferMsg = (this.getMsg('E0020') || '')
      .replace('{0}', this.translateService.translate('date from'));
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
      this.certificate.markAsDirty();
      this.certificate.controls['file'].setValue(data);
    } else {
      this.certificate.markAsDirty();
      this.certificate.controls['file'].setValue(null);
    }
  }
  //end file
  async reset() {
    this.isSubmit = false;
    this.submitFile = false;
    this.isChanged = false;
    this.error = [];
    this.companyName = null;
    this.companyIssue = null;
    this.certificate.reset();
    this.isResetFile = true;
    setTimeout(() => {
      this.isResetFile = false;
    }, 100);
    for (const prop in this.resetCertificate) {
      this.resetCertificate[prop] = true;
      setTimeout(() => {
        this.resetCertificate[prop] = false;
      }, 10);
    }
  }

  async resetForm() {
    if (this.mode === MODE.NEW) {
      await this.reset();
      setTimeout(() => {
        this.certificate.controls['issue_date_from'].setValue(this.dateNow)
        this.showToastr('', this.getMsg('I0007'));
      }, 100);
    }
    else {
      this.isResetFile = true;
      setTimeout(() => {
        this.isResetFile = false;
      }, 100);
      this.error = [];
      this.isClearError = true;
      setTimeout(() => {
        this.isClearError = false;
      }, 100);
      this.certificate.patchValue({ ...this.certificateClone });
      this.companyName = [{ _key: this.certificateClone.name?._key }];
      this.companyIssue = [{ _key: this.certificateClone.issue_by?._key }];
      this.showToastr('', this.getMsg('I0007'));
    }
  }
  dataSave() {
    const saveData = this.certificate.value;
    saveData['name'] = saveData.name?._key ? saveData.name._key : null;
    saveData['issue_by'] = saveData.issue_by?._key ? saveData.issue_by._key : null;
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    } else {
      saveData['user_id'] = this.authService.getUserID();
    }
    return saveData;
  }

  async saveAndContinue() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.certificate.valid && this.error.length <= 0) {
      this.callLoadingApp();
      await this.cartificateService
        .saveUserCartificate(this.dataSave())
        .then(async (res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            await this.reset();
            setTimeout(() => { this.certificate.controls['issue_date_from'].setValue(this.dateNow) }, 100);
            this.isSave = true;
            this.cancelLoadingApp();
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        }).catch(() => {
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
    if (this.certificate.valid && this.error.length <= 0) {
      this.callLoadingApp();
      await this.cartificateService
        .saveUserCartificate(this.dataSave())
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
        });
    } else {
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.certificate.controls)) {
      if (this.certificate.controls[key].invalid) {
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
        } catch { }
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
      } catch { }
    }
  }

  async find(key: string) {
    if (this.certificate_key) {
      this.callLoadingApp();
      await this.cartificateService
        .findUserByKey(key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {
              const data = r.data[0];
              console.log(data);

              this.certificate.patchValue({ ...data });
              this.certificateClone = this.certificate.value;
              this.companyName = [{ _key: data.name?._key }, { value: data.name?.value }];
              this.companyIssue = [{ _key: data.issue_by?._key }, { value: data.issue_by?.value }];
              this.files = data.file;
              if (this.user_id != data.user_id) {
                this.mode = MODE.VIEW
              }
              this.cancelLoadingApp();
            }
            else {
              this.cancelLoadingApp();
              this.router.navigate([`/404`]);
            }
          }
        });
    }
    return;
  }

  //delete
  async deleteUserById() {
    this.dialogService.open(AitConfirmDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        title: this.getMsg('I0004'),
      },
    })
      .onClose.subscribe(async (event) => {
        if (event) {
          if (this.certificate_key) {
            await this.cartificateService.remove(this.certificate_key).then((res) => {
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
  //end delete
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
      if (this.isSave) {
        this.closeDialog(true);
      } else {
        this.closeDialog(false);
      }
    }
  }

  getTitleByMode() {
    let title = '';
    this.selectFile = this.translateService.translate('select_file');
    if (this.mode === MODE.EDIT) {
      title = this.translateService.translate('edit certificate')
    }
    if (this.mode === MODE.NEW) {
      title = this.translateService.translate('add certificate')
    }
    return title;
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
