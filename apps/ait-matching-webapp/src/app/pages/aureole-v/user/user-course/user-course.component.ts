import { RESULT_STATUS, KEYS } from './../../../../../../../../libs/shared/src/lib/commons/enums';
import { AitAuthService, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, MODE, AitBaseComponent, AitAppUtils } from '@ait/ui';
import { Component, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NbToastrService, NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { isArrayFull, isObjectFull } from '@ait/shared';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

import kanjidate from 'kanjidate';

import { ActivatedRoute, Router } from '@angular/router';
import { UserCourseService } from 'apps/ait-matching-webapp/src/app/services/user-course.service';

@Component({
  selector: 'ait-user-course',
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.scss']
})
export class UserCourseComponent  extends AitBaseComponent implements OnInit {
  course: FormGroup;
  courseClone: any;
  mode = MODE.NEW;
  dateNow = new Date().setHours(0, 0, 0, 0);
  course_key = '';
  companyCenter = [];
  error = [];
  isSubmit = false;  
  submitFile = false;  
  isChanged = false;
  isClear = false;
  isClearErrors = false;
  isResetFile = false;
  resetCourse = {
    _key:false,
    course_number: false,
    description: false,
    file: false,
    is_online: false,
    name:false,
    start_date_from: false,
    start_date_to: false,
    training_center: false,
  };

  resetMasterUser = false;
  selectFile = '';
  defaultValue: any;
  constructor(
    private element: ElementRef,
    private translateService: AitTranslationService,
    private router: Router,
    private dialogService: NbDialogService,
    public userCartificateService : UserCourseService,
    private formBuilder: FormBuilder,
    layoutScrollService: NbLayoutScrollService,
    public activeRouter: ActivatedRoute,
    toastrService: NbToastrService,
    store: Store<AppState>,
    authService: AitAuthService,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, toastrService); 
    this.user_id = this.authService.getUserID();
    this.setModulePage({
      module: 'user',
      page: 'user_course',
    });
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
    // get key form parameters
    this.course_key = this.activeRouter.snapshot.paramMap.get('id');
    if(this.course_key){
      this.mode = MODE.EDIT;
    }
  }
 // get value form
  async ngOnInit(): Promise<any> {  
    if(this.mode == MODE.NEW){
      this.course.controls["start_date_from"].setValue(this.dateNow);
      this.courseClone = this.course.value;
    } else{
    await this.find(this.course_key);    
    }
    await this.course.valueChanges.subscribe((data) => {           
      this.checkAllowSave();
    });
    
    if(this.course.value.start_date_from == null && this.mode == 'NEW'){
      this.course.controls["start_date_from"].setValue(this.dateNow); 
    }  
  }
  checkAllowSave() {
    const courseInfo = { ...this.course.value };
    const courseClone = { ...this.courseClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...courseInfo },
      { ...courseClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }
   takeInputValue(val : any, form: string): void {  
    if(val){
      if(isObjectFull(val) && val.value.length > 0){
        this.course.controls[form].markAsDirty();
        this.course.controls[form].setValue(val?.value[0]?._key);
      } 
      else {
        this.course.controls[form].markAsDirty();
        this.course.controls[form].setValue(val);
      
      }  
    }else{
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

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.course.controls['start_date_from'].value;
    const dateTo = this.course.controls['start_date_to'].value;
    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
      .replace('{0}', this.translateService.translate('date_from'))
      .replace('{1}', this.translateService.translate('date_to'));
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
  async reset(){
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
    if(this.mode === MODE.NEW){
      await this.reset();
      setTimeout(() => {
        this.course.controls['start_date_from'].setValue(this.dateNow)
        this.showToastr('', this.getMsg('I0007'));
      }, 100);      
    }
    else{
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
      this.companyCenter.push({_key: this.courseClone.training_center?._key, value: this.courseClone.training_center?.value});
      this.course.patchValue({ ...this.courseClone });
      this.showToastr('', this.getMsg('I0007'));
    }
    
  }

  async saveAndContinue(){  
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);  
    const saveData = this.course.value;
    saveData['training_center'] = this.course.value.training_center;
    saveData['user_id'] = this.authService.getUserID();    
    if(this.course.value.is_online == null){
      saveData['is_online'] = false;
    }  
    this.error.length
    if(this.course.valid && this.error.length <= 0 ){
      await this.userCartificateService
      .saveCourse(saveData)
      .then(async (res) =>{
        if (res?.status === RESULT_STATUS.OK){
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          await this.reset();
          setTimeout(() => {
            this.course.controls["start_date_from"].setValue(this.dateNow);
          },100);
          
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      });      
    }else{
      this.scrollIntoError();
    }
  }

  async saveAndClose(){
    debugger
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);   
    const saveData = this.course.value;
    saveData['training_center'] = this.course.value.training_center;
    if(this.course.value.is_online == null){
      saveData['is_online'] == false;
    }
    if(this.course.valid && this.error.length <= 0 ){
      await this.userCartificateService
      .saveCourse(saveData)
      .then((res) =>{
        if (res?.status === RESULT_STATUS.OK){
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.router.navigateByUrl('/');
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      });      
    }else{
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.course.controls)) {
      if (this.course.controls[key].invalid) {
        let invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
        if(key == 'file'){
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
  }

  async find(key : string){
    if (this.course_key) {
      debugger
      await this.userCartificateService
        .findCourseByKey(key)
        .then((r) => {             
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {              
              const data = r.data[0];                                         
              this.course.patchValue({ ...data });  
              this.courseClone = this.course.value;       
              this.companyCenter = [{_key: data.training_center?._key}, {value: data.training_center?.value}]; 
              if(this.user_id != data.user_id){
                this.mode = MODE.VIEW
              }                            
            }
            else{
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
        await this.userCartificateService.deleteCourseByKey(this.courseClone._key);
        setTimeout(() => {        
          this.showToastr('', this.getMsg('I0003'));
          history.back();
        }, 100);              
      }
    });
  }
  //end delete

  back(){  
    if(this.isChanged){
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
          history.back()
        }
      });
    }else{
      history.back()
    }
  }

  getTitleByMode() {    
    this.selectFile = this.translateService.translate('select');
    let title = '';
    if(this.mode === MODE.EDIT){
      title = this.translateService.translate('edit course');
    }
    else if(this.mode === MODE.NEW){
      title = this.translateService.translate('add course');
    }
    else{
      title = this.translateService.translate('view course');
    }
    return title;
  }
}
