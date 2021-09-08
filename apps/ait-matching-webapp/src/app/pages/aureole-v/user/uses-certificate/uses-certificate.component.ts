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
  dataMCertificate;
  dataUserCertificate;
  keyMCertificate = '';
  keyUserCertificate = '';
  mode = MODE.NEW;
  dateNow : any = new Date();
  id = '';
  certificate_key = '';
  companyName: any = null;
  companyIssue: any = null;
  isSubmit = false;  
  submitFile = false;  
  isChangeData = false;
  files = [];
  error = null;
  resetUser = {
      name:false,
      file: false,
      issue: false,
      grade: false,
      issueDate: false,
      certificate: false,
      immigration: false,
      description: false,
  };
  isReset = {
    occupation: false,
    work: false,
    business: false,
    size: false
  };

  resetMasterUser = false;
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
    this.certificate = this.formBuilder.group({
      _key : new FormControl(null),
      certificate: new FormControl(null),
      description: new FormControl(null),
      file: new FormControl(null),
      grade: new FormControl(null),
      id : new FormControl(null),
      immigration: new FormControl(null),
      issue: new FormControl(null),  
      issueDate: new FormControl(null),
      keyName:new FormControl(null),
      name: new FormControl(null, [Validators.required]),
    });
    // get key form parameters
    this.certificate_key = this.activeRouter.snapshot.paramMap.get('id');
    if(this.certificate_key){
      this.mode = MODE.EDIT;
    }
  }
 // get value form
  async ngOnInit(): Promise<any> {
    
    this.id = Date.now().toString();
    if(this.certificate_key == null){
      this.certificate.controls["issueDate"].setValue(this.dateNow);
    }
   else{
    this.find(this.certificate_key, 'user_certificate_award');   
    this.findMCertificate(this.certificate_key, 'm_certificate_award')    
   }       
  }

  ngOnChanges(changes: SimpleChanges) {    
  }

  takeInputValue(val : any, form: string): void {  
    console.log(val);
        
    if(isObjectFull(val) && form =="name"){
      this.certificate.controls["name"].setValue(val?.value[0]?.value);
      this.certificate.controls["keyName"].setValue(val?.value[0]?._key);
      
    }
    else if(isObjectFull(val)){
      this.certificate.controls[form].setValue(val?.value[0]?._key);
    } else {
      this.certificate.controls[form].setValue(val);
    }  
    if(this.mode === "EDIT"){
      if( (JSON.stringify(this.dataUserCertificate) !== JSON.stringify(this.certificate.value))){
        this.isChangeData = true;          
      }
      else{
        this.isChangeData = false; 
      }   
    }  
    console.log(JSON.stringify(this.dataUserCertificate));
    console.log(JSON.stringify(this.certificate.value));  
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
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
      // set jp_dob format japan cadidates    
      form === 'dob' && this.setKanjiDate();
    } else {
      this[group].controls[form].setValue(null);
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
    for (const prop in this.resetUser) { 
      this.resetUser[prop] = true;
      setTimeout(() => {
        this.resetUser[prop] = false;
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
        this.companyName = {
          value: this.dataUserCertificate.name,
        };
        this.companyIssue = {
          _key: this.dataUserCertificate.issue,
        };
        this.files = [
          this.dataUserCertificate.file
        ];
        this.certificate.patchValue({ ...this.dataUserCertificate });
        this.showToastr('', this.getMsg('E0002'));
      }, 10);
    }
  }
  async saveUserCartificate(){
    this.certificate.controls['id'].setValue(this.id);
    this.certificate.controls['_key'].setValue(this.keyUserCertificate);    
    return await this.userCartificateService.saveUserCartificate(this.certificate.value);
  }
  async saveMCartificate(){
    this.certificate.controls['id'].setValue(this.id);
    this.certificate.controls['_key'].setValue(this.keyMCertificate);
    console.log(this.certificate.value);
    return await this.userCartificateService.saveMCartificate(this.certificate.value);
  }
  saveAndContinue(){   
    this.error = this.checkDatePicker();
    this.isSubmit = true;    
    if(!this.certificate.valid || this.error.length > 0 ){
      return;     
    }else{
      this.saveUserCartificate();
      this.saveMCartificate();
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
      this.saveUserCartificate();
      this.saveMCartificate();
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
              this.keyMCertificate = data._key;
              this.dataMCertificate = data;   
              // this.dataMCertificate._key="123" 
              console.log(this.dataMCertificate._key);
                             
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
              this.keyUserCertificate = data._key ;         
              this.dataUserCertificate = data;                                    
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
    await this.userCartificateService.deleteUserByKey(this.dataUserCertificate._key,'user_certificate_award')
    await this.userCartificateService.deleteUserByKey(this.dataMCertificate._key, 'm_certificate_award')
  }
  //end delete
  back(){  
    if(JSON.stringify(this.dataUserCertificate) == JSON.stringify(this.certificate.value)){
      history.back();
    }
    else{
      this.dialogService.open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('I0006'),
        },
      }).onClose.subscribe(async (event) => {
        if (event) {
          history.back();
        }
      });
    }
  }
}
