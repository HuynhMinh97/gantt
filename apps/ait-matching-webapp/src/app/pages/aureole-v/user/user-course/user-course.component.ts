import { RESULT_STATUS, KEYS } from './../../../../../../../../libs/shared/src/lib/commons/enums';
import { AitAuthService, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, MODE, AitBaseComponent, AitAppUtils } from '@ait/ui';
import { Component, OnInit, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
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
export class UserCourseComponent  extends AitBaseComponent implements OnInit, OnChanges {
  course: FormGroup;
  courseClone: any;
  dataCourse;
  courseStart;
  mode = MODE.NEW;
  dateNow = new Date().setHours(0, 0, 0, 0);
  course_key = '';
  companyCenter: any = null;
  files = [];
  error = [];
  isSubmit = false;  
  submitFile = false;  
  isChanged = false;
  isClear = false;
  isClearErrors = false;
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
  isReset = {
    occupation: false,
    work: false,
    business: false,
    size: false
  };

  resetMasterUser = false;
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
    this.setModulePage({
      module: 'user',
      page: 'user_cerfiticate',
    });
    this.course = this.formBuilder.group({
      _key : new FormControl(null),
      course_number: new FormControl(null),
      description: new FormControl(null),  
      file: new FormControl(null),
      is_online: new FormControl(null),
      name : new FormControl(null, [Validators.required]),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      training_center: new FormControl(null),
      
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
      this.courseStart = this.course.value
    } else{
    await this.find(this.course_key);    
    }
     await this.course.valueChanges.subscribe((data) => {           
      if (this.course.pristine) {
        console.log(data); 
        this.courseClone = AitAppUtils.deepCloneObject(data);       
      } else {
        this.checkAllowSave();
      }
    });

    if(this.course.value.start_date_from == null){
      this.course.controls["start_date_from"].setValue(this.dateNow); 
    }  
    console.log(this.courseClone);
      
  }
  checkAllowSave() {
    const courseInfo = { ...this.course.value };
    const courseClone = { ...this.courseClone };
    console.log(courseInfo);
    console.log(courseClone);
    
    // this.setHours(userInfo);
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...courseInfo },
      { ...courseClone }
    );
    this.isChanged = !(isChangedUserInfo);
    console.log(this.isChanged, this.mode);
  }
  ngOnChanges(changes: SimpleChanges) {    
  }

  takeInputValue(val : any, form: string): void {  
    if(val){
      if(isObjectFull(val)){
        this.course.controls[form].markAsDirty();
        this.course.controls[form].setValue(val?.value[0]?._key);
      } 
      else {
        this.course.controls[form].markAsDirty();
        this.course.controls[form].setValue(val);
      
      }  
    }else{
      this.course.controls[form].setValue(null);
    }      
    if(form == 'name' && val.length<=2 || form == 'description' && val.length<=4){
      this.isClearErrors = true;
      setTimeout(() => {
        this.isClearErrors = false;
      }, 100);
    }
  }

  toggleCheckBox(checked: boolean) {  
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
      if(form == 'start_date_to'){
        this.error = this.checkDatePicker();
      }
    } else {
      this[group].controls[form].setValue(null);
      form === 'dob' && this.course.controls['dob_jp'].setValue(null);
    }
  }

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.course.controls['start_date_from'].value;
    const dateTo = this.course.controls['start_date_to'].value;

    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
        .replace('{0}', ' start date from ')
        .replace('{1}',' start date to ');
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
      this.course.controls['file'].setValue(data);
    } else {
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
    for (const prop in this.resetCourse) { 
      this.resetCourse[prop] = true;
      setTimeout(() => {
        this.resetCourse[prop] = false;
      }, 10);
    }
  }

  async resetForm() {
    await this.reset();
    if(this.mode === MODE.NEW){
      setTimeout(() => {
        this.course.controls['start_date_from'].setValue(this.dateNow)
      }, 100);      
    }
    else{
      setTimeout(() => {
        this.companyCenter = {
          _key: this.dataCourse.training_center,
        };
        this.files = [
          this.dataCourse.file
        ];
        this.course.patchValue({ ...this.dataCourse });
        this.showToastr('', this.getMsg('E0002'));
      }, 10);
    }
  }

  async saveAndContinue(){  
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);  
    const saveData = this.course.value;
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
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  async saveAndClose(){
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);   
    const saveData = this.course.value;
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
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
    }
  }

  async find(key : string){
    if (this.course_key) {
      await this.userCartificateService
        .findCourseByKey(key)
        .then((r) => {             
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {              
              const data = r.data[0];                                         
              this.course.patchValue({ ...data });  
              this.courseClone = this.course.value;       
              this.companyCenter = {
                _key: data.training_center,
              };
              this.files = data.file;                           
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
        await this.userCartificateService.deleteCourseByKey(this.dataCourse._key);
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
}
