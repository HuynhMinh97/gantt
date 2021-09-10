import { AitAuthService, AitConfirmDialogComponent, AitEnvironmentService, AitTranslationService, AppState, MODE, AitBaseComponent, AitAppUtils } from '@ait/ui';
import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
  mode = MODE.NEW;
  dateNow = new Date().setHours(0, 0, 0, 0);
  companyName: any = null;
  companyIssue: any = null;
  files = [];
  isSubmit = false;  
  submitFile = false;  
  isChanged = false;
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

    this.setModulePage({
      module: 'user',
      page: 'user_cerfiticate',
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
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.certificate.controls[form].markAsDirty();
      this.certificate.controls[form].setValue(value);
      // set jp_dob format japan cadidates    
      form === 'dob' && this.setKanjiDate();
      if(form == 'issue_date_to'){
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
    const dateFrom = this.certificate.controls['issue_date_from'].value;
    const dateTo = this.certificate.controls['issue_date_to'].value;

    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
        .replace('{0}', 'issue_date_from ')
        .replace('{1}','issue_date_to ');
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
  async reset(){
    this.isSubmit = false;
    this.submitFile = false;
    this.isChanged = false;
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

  async resetForm() {
    if(this.mode === MODE.NEW){
      await this.reset();
      setTimeout(() => {
        this.certificate.controls['issue_date_from'].setValue(this.dateNow)
        this.showToastr('', this.getMsg('E0001'));
      }, 100);      
    }
    else{  
      const dataOld = this.certificateClone;
      console.log(dataOld);  
      await this.reset();
      setTimeout(() => {
        this.certificate.patchValue({...dataOld});
        console.log(this.certificate.value);
        console.log(dataOld);  
        this.companyName = {
          _key: dataOld.name,
        };
        this.companyIssue = {
          _key: dataOld.issue_by,
        };
        // this.files = dataOld.file;  
        this.showToastr('', this.getMsg('E0002'));
      }, 100);
    }
  }
 
  async saveAndContinue(){  
    this.isSubmit = true; 
    const saveData = this.certificate.value;
    saveData['user_id'] = this.authService.getUserID();
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    }
    if(!this.certificate.valid  ){
      return;     
    }else{      
      this.submitFile = true;
      await this.cartificateService.saveUserCartificate(saveData);
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
  async saveAndClose(){
    this.isSubmit = true; 
    const saveData = this.certificate.value;
    saveData['user_id'] = this.authService.getUserID();
    if (this.certificate_key) {
      saveData['_key'] = this.certificate_key;
    }
    if(!this.certificate.valid  ){
      return;     
    }else{      
      this.submitFile = true;
      await this.cartificateService.saveUserCartificate(saveData);
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
              this.companyName = {
                _key: data.name,
              };
              this.companyIssue = {
                _key: data.issue_by,
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
}
