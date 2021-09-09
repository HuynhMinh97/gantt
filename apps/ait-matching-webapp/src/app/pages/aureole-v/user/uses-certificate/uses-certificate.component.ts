import { AitAuthService, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, MODE, AitBaseComponent } from '@ait/ui';
import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NbToastrService, NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
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
export class UsesCertificateComponent  extends AitBaseComponent implements OnInit, OnChanges {
  certificate: FormGroup;
  mode = MODE.NEW;
  dateNow = new Date().setHours(0, 0, 0, 0);
  companyName: any = null;
  companyIssue: any = null;
  files = [];
  isSubmit = false;  
  submitFile = false;  
  isChangeData = false;
  error = null;
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
  isReset = {
    occupation: false,
    work: false,
    business: false,
    size: false
  };
  certificate_key: string;
  constructor(
    private translateService: AitTranslationService,
    private router: Router,
    private dialogService: NbDialogService,
    public userCartificateService : UserCerfiticateService,
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
      page: 'user_education',
    });

    this.certificate = this.formBuilder.group({
      _key : new FormControl(null),
      name:new FormControl(null,[ Validators.required ]),
      certificate_award_number: new FormControl(null),
      grade: new FormControl(null),
      issue_by: new FormControl(null),
      issue_date_from: new FormControl(null),
      issue_date_to : new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null),  
    });
    // get key form parameters
    this.certificate_key = this.activeRouter.snapshot.paramMap.get('id');
    if(this.certificate_key){
      this.mode = MODE.EDIT;
    }
  }
 // get value form
  async ngOnInit(): Promise<any> {     
    if(this.certificate_key == null){
      this.certificate.controls["issue_date_from"].setValue(this.dateNow);
    }
   else{
    this.find(this.certificate_key, 'user_certificate_award');   
    this.findMCertificate(this.certificate_key, 'm_certificate_award')    
   }       
  }

  ngOnChanges(changes: SimpleChanges) {    
  }

  takeInputValue(val : any, form: string): void {      
    if (val) {
      console.log(val,form);
      
      if(isObjectFull(val)){          
          this.certificate.controls[form].setValue(val?.value[0]?._key);
      }else {
        this.certificate.controls[form].markAsDirty();
        this.certificate.controls[form].setValue(val);
      }  
    } else {
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

  takeDatePickerValue(value: number, form: string) {   
    console.log(value);
    
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(value);
      // set jp_dob format japan cadidates    
      form === 'dob' && this.setKanjiDate();
      if(form == 'start_date_to'){
        this.error = this.checkDatePicker();
      }
    } else {
      this.certificate.controls[form].setValue(null);
      form === 'dob' && this.certificate.controls['dob_jp'].setValue(null);
    }
  }

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.certificate.controls['issueDate'].value;
    const dateTo = this.certificate.controls['immigration'].value;

    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
        .replace('{0}', 'issueDate')
        .replace('{1}','immigration');
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
      this.certificate.controls['file'].setValue(data);
    } else {
      this.certificate.controls['file'].setValue(null);
    }
    
    
  }
   //end file
  reset(){
    this.isSubmit = false;
    this.submitFile = false;
    this.error = null;
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

  resetForm() {
    this.reset();
    if(this.mode === MODE.NEW){
      setTimeout(() => {
        this.certificate.controls['issueDate'].setValue(this.dateNow)
      }, 100);      
    }
    else{
      setTimeout(() => {
       
        this.showToastr('', this.getMsg('E0002'));
      }, 10);
    }
  }
 
  saveAndContinue(){  
    this.isSubmit = true; 
    const saveData = this.certificate.value;
    saveData['user_id'] = this.authService.getUserID();
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    }
    if(!this.certificate.valid || this.error.length > 0 ){
      return;     
    }else{
      
      this.submitFile = true;
      if(this.mode == MODE.NEW){
        this.showToastr('', this.getMsg('I0001'));
      }
      else{
        this.showToastr('', this.getMsg('I0002'));
      }   
      setTimeout(() =>{
        this.reset();
      },100)        
    }
  }
  saveAndClose(){
    this.error = this.checkDatePicker();
    this.isSubmit = true;    
    if(!this.certificate.valid || this.error.length > 0 ){
      return;     
    }else{
      this.submitFile = true;
      if(this.mode == MODE.NEW){
        this.showToastr('', this.getMsg('I0001'));
      }
      else{
        this.showToastr('', this.getMsg('I0002'));
      }   
      setTimeout(() =>{
        this.router.navigateByUrl('/');
      },100)        
    }
  }
  async findMCertificate(key : string, table : string){
    if (this.certificate_key) {
      await this.userCartificateService
        .findUserByKey(key,table)
        .then((r) => {             
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {
              this.mode = MODE.EDIT;
              const data = r.data[0]; 
              // this.dataMCertificate._key="123" 
                             
            }
           }
        });
    }   
    return;  
  }

  async find(key : string, table : string){
    if (this.certificate_key) {
      await this.userCartificateService
        .findUserByKey(key,table)
        .then((r) => {             
          if (r.status === RESULT_STATUS.OK) {
            if (r.data.length > 0) {
              const data = r.data[0];  
              console.log(data);                                               
              this.certificate.patchValue({ ...data });         
              this.companyName = {
                _key: data.keyName,
              };
              this.companyIssue = {
                _key: data.issue,
              };
              this.files = data.file;                          
            }
            else{
              this.router.navigate([`/user/`]);
              setTimeout(() => {                
                this.showToastr('', this.getMsg('E0005'),'warning');
              }, 50);              
            }
           }
        });
    }   
    return;   
  }
  //delete
  async deleteUserById() {
    this.dialogService.open(AitConfirmDialogComponent, {
      context: {
        title: this.translateService.translate('このデータを削除しますか。'),
      },
    })
    .onClose.subscribe(async (event) => {
      if (event) {
        this.onDelete();
        setTimeout(() => {        
          this.showToastr('', this.getMsg('I0003'));
          history.back();
        }, 100);              
      }
    });
  }
  async onDelete() {
  }
  //end delete
  back(){  
    // if(JSON.stringify() == JSON.stringify(this.certificate.value)){
    //   history.back();
    // }
    // else{
    //   this.dialogService.open(AitConfirmDialogComponent, {
    //     context: {
    //       title: this.translateService.translate('I0006'),
    //     },
    //   }).onClose.subscribe(async (event) => {
    //     if (event) {
    //       history.back();
    //     }
    //   });
    // }
  }
}
