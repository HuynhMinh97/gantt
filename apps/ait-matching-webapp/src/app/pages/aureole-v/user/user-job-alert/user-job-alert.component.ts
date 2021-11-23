import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, getUserSetting, MODE } from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';
import { UserJobAlertService } from 'apps/ait-matching-webapp/src/app/services/user-job-alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ait-user-job-alert',
  templateUrl: './user-job-alert.component.html',
  styleUrls: ['./user-job-alert.component.scss']
})
export class UserJobAlertComponent extends AitBaseComponent implements OnInit {
  userjobAlert: FormGroup;
  userjobAlertClone:any;
  isSubmit = false;
  mode = "NEW";
  isChanged = false;
  errorArr = [];
  dayNow ='';
  dateFormat = "dd/MM/yyyy";
  userKey = "";
  industrys = [];
  experienceLevels = [];
  employeeTypes = [];
  locations = [];
  errorDate = [];
  errorSalary = [];
  resetUserjobAlert = {
    industry: false,
    experience_level: false,
    employee_type: false,
    location: false,
    start_date_from: false,
    start_date_to: false,
    salary_from: false,
    salary_to: false,
  }
  constructor(store: Store<AppState>,
    private userJobAlertService : UserJobAlertService,
    private router: Router,
    authService: AitAuthService,
    apollo: Apollo,
    private element: ElementRef,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, toastrService);

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.setModulePage({
      module: 'user',
      page: 'user_job_alert',
    });
    this.userjobAlert = this.formBuilder.group({
      industry: new FormControl(null),
      experience_level: new FormControl(null),
      employee_type: new FormControl(null),
      location: new FormControl(null),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      salary_from: new FormControl(null),
      salary_to: new FormControl(null),
      _key: new FormControl(null),
      user_id: new FormControl(null),

    })
    this.userKey = this.activeRouter.snapshot.paramMap.get('id');
    if (this.userKey) {
      if(this.userKey == this.user_id){
        this.mode = MODE.EDIT;
      }else{
        this.mode = MODE.VIEW;
      }
      
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getMasterData();
    this.dayNow = this.getDateFormat(Date.now());
    this.userjobAlert.controls["start_date_from"].setValue(Date.now());
    this.getUserJobAlert();
    await this.userjobAlert.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });
    
  }

  checkAllowSave() {
    const userjobAlert = { ...this.userjobAlert.value };
    const userjobAlertClone = { ...this.userjobAlertClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userjobAlert },
      { ...userjobAlertClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }
  async getMasterData() {
    try {
      if (!this.dateFormat) {
        const masterValue = await this.getUserSettingData('USER_SETTING');
        const setting = await this.findUserSettingCode();
        if (isObjectFull(setting) && isArrayFull(masterValue)) {
          const format = setting['date_format_display'];
          const data = masterValue.find(item => item.code === format);
          if (data) {
            this.dateFormat = data['name'];
          }
        }
      }
    } catch (e) {
    }
  } 

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }
  takeMasterValue(value: any, target: string): void {

  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }else{
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
    this.errorDate = this.checkDatePicker();
  }

  takeInputNumberValue(value: any, group: string, form: string) {  
    if (value !== '' && value !== null && !isNaN(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(Number(value));
    } else {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
    this.errorSalary = this.checkSalary();
  }
  takeMasterValues(val: any, form: string): void {   
    if (val) {
      if(isObjectFull(val)  && val.value.length > 0 ){          
        const data = [];       
        val.value.forEach((item) => {
          data.push(item._key);
        });
        this.userjobAlert.controls[form].markAsDirty();
        this.userjobAlert.controls[form].setValue(data);                        
      }
    }else{
      this.userjobAlert.controls[form].markAsDirty();
      this.userjobAlert.controls[form].setValue(null);
    }    
        
  }

  checkDatePicker() {
    const res = [];
    const msg = this.getMsg('E0004');
    const dateFrom = this.userjobAlert.controls['start_date_from'].value;
    const dateTo = this.userjobAlert.controls['start_date_to'].value;
    if (dateFrom > dateTo && dateTo != null) {
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('available time from'))
        .replace('{1}', this.translateService.translate('available time to'));
      res.push(transferMsg);
    }
    return res;
  }

  checkSalary() {
    const res = [];
    const msg = this.getMsg('E0004');
    const salaryFrom = this.userjobAlert.controls['salary_from'].value;
    const salaryTo = this.userjobAlert.controls['salary_to'].value;
    if (salaryFrom > salaryTo && salaryTo != null) {
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('minimum salary'))
        .replace('{1}', this.translateService.translate('maximum salary'));
      res.push(transferMsg);
    }
    return res;
  }
  getUserJobAlert(){
    this.userJobAlertService.findUserJobAlert(this.userKey)
    .then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        if (res.data.length > 0) {
          const data = res.data[0];
          this.userjobAlert.patchValue({ ...data });
          this.userjobAlertClone = this.userjobAlert.value;
          this.industrys = data.industry;
          this.experienceLevels = data.experience_level;
          this.employeeTypes = data.employee_type;
          this.locations = data.location;
          console.log(this.userjobAlert.value);
          
        }
        else {
          this.router.navigate([`/404`]);
        }
      }
    })
  }

  saveAndContinue(){
    if(this.errorDate.length > 0 || this.errorSalary.length > 0 ){
      this.scrollIntoError();
      return;
    }else{
      const dataSave = this.userjobAlert.value;
      if(this.mode == "NEW"){
        dataSave['user_id'] = this.authService.getUserID();
      }
      this.userJobAlertService.saveUserJobAlert(this.userjobAlert.value)
      .then((res) => {
        if (res?.status === RESULT_STATUS.OK) {
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.reset();
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      })  
    }  
  }

  saveAndClose(){
    if(this.errorDate.length > 0 || this.errorSalary.length > 0 ){
      this.scrollIntoError();
      return;
    }else{
      const dataSave = this.userjobAlert.value;
      if(this.mode == "NEW"){
        dataSave['user_id'] = this.authService.getUserID();
      }
      this.userJobAlertService.saveUserJobAlert(this.userjobAlert.value)
      .then((res) => {
        if (res?.status === RESULT_STATUS.OK) {
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          history.back();
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      })
    }    
  }

  async reset() {
    this.errorDate = [];
    this.errorSalary = [];
    this.isSubmit = false;
    this.isChanged = false;
    this.userjobAlert.reset();
    for (const prop in this.resetUserjobAlert) {
      this.resetUserjobAlert[prop] = true;
      setTimeout(() => {
        this.resetUserjobAlert[prop] = false;
      }, 10);
    }
    setTimeout(() => {
      this.userjobAlert.controls["start_date_from"].setValue(Date.now());
    }, 100);  
    console.log(this.userjobAlertClone);     
  }
  
  resetForm(){
    if(this.mode == MODE.NEW){
      this.reset();
    }
    if(this.mode == MODE.EDIT){
      this.industrys = [];
      this.experienceLevels = [];
      this.employeeTypes =[];
      this.locations = [];
      setTimeout(() => {
        this.industrys = this.userjobAlertClone.industry;
        this.experienceLevels = this.userjobAlertClone.experience_level;
        this.employeeTypes = this.userjobAlertClone.employee_type;
        this.locations = this.userjobAlertClone.location;
        this.userjobAlert.patchValue({ ...this.userjobAlertClone });
        this.showToastr('', this.getMsg('I0007'));
      },100)
     
    }
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
            // this.closeDialog(false);
          }
        });
    } else {
      history.back();
      // this.closeDialog(false);
    }
  }
  scrollIntoError() {
    for (const key of Object.keys(this.userjobAlert.controls)) {
      if (this.userjobAlert.controls[key].invalid) {
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
  }
  skip(){
    this.router.navigate([`recommenced-user`]);
  }

}
