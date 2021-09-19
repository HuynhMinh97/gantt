import { AitAuthService, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, MODE, AitBaseComponent, AitAppUtils } from '@ait/ui';
import { Component, ElementRef, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NbToastrService, NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import kanjidate from 'kanjidate';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCerfiticateService } from 'apps/ait-matching-webapp/src/app/services/user-certificate.service';


@Component({
  selector: 'ait-uses-certificate',
  templateUrl: './uses-certificate.component.html',
  styleUrls: ['./uses-certificate.component.scss']
})
export class UsesCertificateComponent  extends AitBaseComponent implements OnInit {
  certificate: FormGroup;
  certificateClone: any;
  dataOld: any;
  mode = MODE.NEW;
  dateNow = new Date().setHours(0, 0, 0, 0);
  companyName: any = null;
  companyIssue: any = null;
  files = [];
  isSubmit = false;  
  submitFile = false;  
  isChanged = false;
  error = [];
  resetCertificate = {
      name:false,
      certificate_award_number: false,
      grade: false,
      issue_by: false,
      issue_date_from: false,
      issue_date_to: false,
      description: false,
      file: false,
  };
  certificate_key: string;
  selectFile = "";
;
  constructor(
    private element: ElementRef,
    private translateService: AitTranslationService,
    private router: Router,
    private dialogService: NbDialogService,
    public cartificateService : UserCerfiticateService,
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
      page: 'user_cerfiticate',
    });

    this.certificate = this.formBuilder.group({
      _key : new FormControl(null),
      name: new FormControl(null,[Validators.required, Validators.maxLength(200)]),
      certificate_award_number: new FormControl(null),
      grade: new FormControl(null),
      issue_by: new FormControl(null),
      issue_date_from: new FormControl(null),
      issue_date_to : new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null,[Validators.maxLength(5)]),  
    });
    // get key form parameters
    this.certificate_key = this.activeRouter.snapshot.paramMap.get('id');
    if(this.certificate_key){
      this.mode = MODE.EDIT;
    }
  }
 // get value form
  async ngOnInit(): Promise<any> {    
    if(this.mode == MODE.NEW){
      this.certificate.controls["issue_date_from"].setValue(this.dateNow); 
    }else{
      await this.find(this.certificate_key); 
    } 
    await this.certificate.valueChanges.subscribe((data) => {      
      if (this.certificate.pristine) {
        this.certificateClone = AitAppUtils.deepCloneObject(data);      
      } else {
        this.checkAllowSave();
      }
    });
    if(this.certificate.value.issue_date_from == null && this.mode == "NEW"){
      this.certificate.controls["issue_date_from"].setValue(this.dateNow); 
    }
  }

  checkAllowSave() {
    const certificateInfo = { ...this.certificate.value };
    const certificateClone = { ...this.certificateClone };
    // this.setHours(userInfo);
    
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...certificateInfo },
      { ...certificateClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }

  takeInputValue(val : any, form: string): void {      
    if (val) {
      if(isObjectFull(val)){ 
        this.certificate.controls[form].markAsDirty();         
          this.certificate.controls[form].setValue(val?.value[0]?._key);
      }else {
        this.certificate.controls[form].markAsDirty();
        this.certificate.controls[form].setValue(val);
      }  
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

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.certificate.controls['issue_date_from'].value;
    const dateTo = this.certificate.controls['issue_date_to'].value;
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
      this.certificate.markAsDirty();
      this.certificate.controls['file'].setValue(data);
    } else {
      this.certificate.markAsDirty();
      this.certificate.controls['file'].setValue(null);
    } 
  }
   //end file
  async reset(){
    this.isSubmit = false;
    this.submitFile = false;
    this.isChanged = false;
    this.error = [];
    this.companyName = null;
    this.companyIssue = null;
    this.certificate.reset();
    for (const prop in this.resetCertificate) { 
      this.resetCertificate[prop] = true;
      setTimeout(() => {
        this.resetCertificate[prop] = false;
      }, 10);
    }
  }

  async resetForm() {
    if(this.mode === MODE.NEW){
      await this.reset();
      setTimeout(() => {
        this.certificate.controls['issue_date_from'].setValue(this.dateNow)
        this.showToastr('', this.getMsg('I0007'));
      }, 100);      
    }
    else{  
      this.error = [];
      for (const index in this.resetCertificate) {
        if (!this.certificate.controls[index].value) {
          this.resetCertificate[index] = true;
          setTimeout(() => {
            this.resetCertificate[index] = false;
          }, 100);
        }
      }    
      this.certificate.patchValue({...this.certificateClone});  
      this.companyName = {_key: this.certificateClone.name};
      this.companyIssue = {_key: this.certificateClone.issue_by};         
      this.showToastr('', this.getMsg('I0007'));    
    }
  }
 
  async saveAndContinue(){ 
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);  
    const saveData = this.certificate.value;   
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    }else{
      saveData['user_id'] = this.authService.getUserID();
    }
    this.error.length
    if(this.certificate.valid && this.error.length <= 0 ){
      await this.cartificateService
      .saveUserCartificate(saveData)
      .then(async (res) =>{
        
        if (res?.status === RESULT_STATUS.OK){
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          await this.reset();
          setTimeout(() => {
            this.certificate.controls['issue_date_from'].setValue(this.dateNow)
          }, 100); 
                 
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
    this.isSubmit = true; 
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);  
    const saveData = this.certificate.value;
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    }else{
      saveData['user_id'] = this.authService.getUserID();
    }
    if(this.certificate.valid && this.error.length <= 0 ){
      await this.cartificateService
      .saveUserCartificate(saveData)
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
    for (const key of Object.keys(this.certificate.controls)) {
      if (this.certificate.controls[key].invalid) {
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
    if (this.certificate_key) {
      await this.cartificateService
        .findUserByKey(key)
        .then((r) => {             
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {
             
              const data = r.data[0];                                                
              this.certificate.patchValue({ ...data });
              this.certificateClone = this.certificate.value;  
              console.log(this.certificate.value);
                     
              this.companyName = {
                _key: data.name,
              };
              this.companyIssue = {
                _key: data.issue_by,
              };
              this.files = data.file;                
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
        if (this.certificate_key) {
          await this.cartificateService.remove(this.certificate_key).then((res) => {
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
    let title = '';
    this.selectFile = this.translateService.translate('select_file');
    if(this.mode === MODE.EDIT){
      title = this.translateService.translate('edit certificate')
    }
    else if(this.mode === MODE.NEW){
      title = this.translateService.translate('add certificate')
    }
    else{
      title = this.translateService.translate('view certificate')
    }
    return title;
  }
}
