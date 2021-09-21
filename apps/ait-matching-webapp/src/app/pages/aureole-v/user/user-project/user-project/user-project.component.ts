import { title } from 'node:process';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AitMasterDataService, AitTranslationService, AitUserService, AppState, getCaption, getLang, MODE } from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogService, NB_THEME_OPTIONS } from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectService } from './../../../../../services/user-project.service';
import { Subscription } from 'rxjs';
import { UserProjectDto, UserProjectErrorsMessage } from './interface';
import { isArrayFull, isObjectFull, KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent extends AitBaseComponent implements OnInit {
  mode = MODE.NEW;
  isChanged = false;
  isSubmit = false;
  userProject: FormGroup;
  sort_no = 0;
  job_company: any = '';
  userProjectClone: any;
  isReset = false;
  dateNow = new Date().setHours(0, 0, 0, 0);
  defaultCompany = {} as KeyValueDto;
  keyTitle = '';
  keyCompany = '';
  error = [];
  listSkills : any;
  stateProjectInfo = {} as UserProjectDto;
  stateProjectInfoDf = {} as UserProjectDto;
  dataOld : any;
  connection_user_project = {
    _from:'',
    _to:'',
    relationship: '',
    sort_no: 0,
  }
  biz_project_skill = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };
  resetUserProject = {
    name: false,
    start_date_from: false,
    start_date_to: false,
    company_working: false,
    title: false,
    description: false,
    skills: false,
    responsibility: false,
    achievement: false
  };
  isClearErrors  = {
    name: false,
    company_working: false,
    title: false,
    description: false,
    skills: false,
    responsibility: false,
    achievement: false
  };

  userProjectErros = new UserProjectErrorsMessage();

  dateField = [
    'start_date_from',
    'start_date_to'
  ];
  project_key = '';
  constructor(
    private element: ElementRef,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    public router: Router,
    private userProjectService: UserProjectService,
    public activeRouter: ActivatedRoute,
    private translateService: AitTranslationService,
    public store: Store<AppState | any>,
    public authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    apollo: Apollo

  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService
    );
    this.setModulePage({
      module: 'user',
      page: 'user_project',
    });
    this.userProject = this.formBuilder.group({
      _key: new FormControl(null),
      name: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      company_working: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
      skills: new FormControl(null, [Validators.required,Validators.maxLength(10)]),
      responsibility: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
      achievement: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
    });

    // get key form parameters
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.project_key) {
      this.mode = MODE.EDIT;
    }
  }
  

  async ngOnInit() {  
    if(this.mode === "NEW"){
      await this.inputProject(); 
      this.userProject.controls["start_date_from"].setValue(this.dateNow);
      this.userProject.controls['title'].setValue( this.keyTitle);
      this.userProject.controls['company_working'].setValue(this.keyCompany);
      this.userProjectClone = this.userProject.value;
    }else{
      await this.findBizProject();
      await this.findSkills();      
    }
    await this.userProject.valueChanges.subscribe((data) => {      
      this.checkAllowSave();
    });
  }

  async findBizProject(){
    const res = await this.userProjectService.find(this.project_key);
    const data = res.data[0];  
    if(res.data.length > 0 ){
      this.userProject.patchValue({ ...data });
      this.userProjectClone = this.userProject.value;
      if(data.user_id != this.user_id){
        this.mode = MODE.VIEW;
      }
    }else{
      this.router.navigate([`/404`]); 
    }        
   
  }

  async findSkills(){
    const from = 'biz_project/' + this.project_key;
    await this.userProjectService.findFromBizProjectSkill(from).then((res) => {
      
      let listSkills = []
      res.data.forEach((key) =>{
        listSkills.push({_key:key._to.substring(8)} );
      })
      this.userProject.controls['skills'].setValue(listSkills);
      this.dataOld = this.userProject.value; 
      this.userProjectClone = this.userProject.value;
    })
    console.log(this.dataOld);
    
  }

  async inputProject(){    
    await this.userProjectService
      .findKeyTitle(this.env.COMMON.COMPANY_DEFAULT, this.user_id)
      .then((res) =>{
        this.keyTitle = res.data[0].title;
        this.keyCompany = res.data[0].company_working; 
      });
  }

  takeInputValue(val: any, form: string): void { 
    if (val) {
      if(isObjectFull(val) && val.value.length >0 ){  
        if (form == 'skills') {          
          const data = [];       
          val.value.forEach((item) => {
            data.push(item);
          });
          this.userProject.markAsDirty();
          this.userProject.controls['skills'].setValue(data);
        }else{
          this.userProject.markAsDirty();
          this.userProject.controls[form].setValue(val?.value[0]?._key);
        }     
      } 
      else {
        this.userProject.controls[form].markAsDirty();
        this.userProject.controls[form].setValue(val);
       
      }  
    } else {
      this.userProject.markAsDirty();
      this.userProject.controls[form].setValue(null);
      // this.isClearErrors[form] = true;
      // setTimeout(() => {
      //   this.isClearErrors[form] = false;
      // }, 100);
    }       
  }

  takeDatePickerValue(value: number, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.userProject.controls[form].markAsDirty();
      this.userProject.controls[form].setValue(value);
    } else {
      this.userProject.controls[form].markAsDirty();
      this.userProject.controls[form].setValue(null);
    }   
    this.error = this.checkDatePicker();
  }

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.userProject.controls['start_date_from'].value;
    const dateTo = this.userProject.controls['start_date_to'].value;

    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('date from'))
        .replace('{1}', this.translateService.translate('date to'));
        res.push(transferMsg);
    }   
    return res;
  }

  getI18n() {
    //TODO about I18n
  }

  getArrayData = (data: any[]) => {
    if (!data || data.length === 0) {
      return []
    }
    return Array.from(new Set(data.map(d => d?._key).filter(x => !!x)));
  }
// chuan hoa data de save
  dataSaveProject(){
    const saveData = this.userProject.value;
    saveData['user_id'] = this.authService.getUserID();
    this.listSkills = saveData.skills;
    delete saveData.skills;  
    return saveData;
  }

  async saveSkill(bizProjectKey: string) {
    this.biz_project_skill._from = 'biz_project/' + bizProjectKey;
    this.biz_project_skill.relationship = ' biz_project skill';
    if(this.mode == 'EDIT'){
      const _fromSkill = [
        { _from: 'biz_project/' + this.project_key },
      ];
      this.userProjectService.removeSkill(_fromSkill);
    }
    this.listSkills.forEach(async (skill) => {
      await this.userProjectService.findMSkillsByCode(skill._key)
      .then(async (res) => {
        this.sort_no += 1;
        this.biz_project_skill.sort_no = this.sort_no;
        this.biz_project_skill._to = 'm_skill/' + res.data[0]._key;
        await this.userProjectService.saveSkills(this.biz_project_skill);
      });
    });
  }
  
  async saveUserProject(bizProjectKey: string){
    this.connection_user_project._from = 'sys_user/' + this.user_id;
    this.connection_user_project._to = 'biz_project/' + bizProjectKey;
    this.connection_user_project.relationship = 'user project';
    this.connection_user_project.sort_no = this.sort_no + 1;
    await this.userProjectService.saveConnectionUserProject(this.connection_user_project);
  }

  async saveContinue() { 
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if(this.userProject.valid){
      await this.userProjectService.save(this.dataSaveProject(),'biz_project' )
      .then(async (res) => {  
        if (res?.status === RESULT_STATUS.OK) {        
          const data = res.data[0];
          await this.saveSkill(data._key);
          await this.saveUserProject(data._key);  
          const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message); 
          await this.reset();     
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }      
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      })
    }else{
      this.scrollIntoError();
    }   
  }

  async saveClose(){
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if(this.userProject.valid){
      await this.userProjectService.save(this.dataSaveProject(),'biz_project' )
      .then(async (res) => {  
        if (res?.status === RESULT_STATUS.OK) {        
          const data = res.data[0];
          await this.saveSkill(data._key);
          await this.saveUserProject(data._key);  
          const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);  
          this.router.navigateByUrl('/');    
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }      
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      })
    }else{
      this.scrollIntoError();
    }   
  }

  scrollIntoError() {
    for (const key of Object.keys(this.userProject.controls)) {
      if (this.userProject.controls[key].invalid) {
        const invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
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

  setHours(data: any) {
    for (const prop in data) {
      if (this.dateField.includes(prop)) {
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
      }
    }
  }
  checkAllowSave() {
    const userInfo = { ...this.userProject.value };
    const userInfoClone = { ...this.userProjectClone };
    // this.setHours(userInfo);
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }

  async reset(){
    this.isSubmit = false;
    this.isChanged = false;
    this.error = [];
    this.dataOld = this.userProjectClone;
    this.userProject.reset();
    for (const prop in this.resetUserProject) {
      this.resetUserProject[prop] = true;
      setTimeout(() => {
        this.resetUserProject[prop] = false;
      }, 100);
    }
    setTimeout(() => { 
      this.isReset = false;
      this.userProject.controls["start_date_from"].setValue(this.dateNow);
      this.userProject.controls['title'].setValue( this.keyTitle);
      this.userProject.controls['company_working'].setValue(this.keyCompany);
    }, 100);
    console.log(this.userProject.value);
    console.log(this.userProjectClone);
    
    
  }

  async resetForm() {
    this.isSubmit = false;
    this.isChanged = false;
    if (this.mode === MODE.EDIT) {
      this.error =[];
      for (const index in this.resetUserProject) {
        if (!this.userProject.controls[index].value ) {
          this.resetUserProject[index] = true;
          setTimeout(() => {
            this.userProject[index] = false;
          }, 100);
        }
      }
      this.isClearErrors.skills = true;
      setTimeout(() => {
        this.isClearErrors.skills = false;
        this.userProject.patchValue({ ...this.dataOld });;
        console.log(this.userProject.value);
        this.showToastr('', this.getMsg('I0007'));
      },100)            
    }
    else {
      await this.reset();
      this.showToastr('', this.getMsg('I0007'));
    }
  }
  async Delete() {  
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
          if (this.project_key) {
            await this.userProjectService.remove(this.project_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                const _fromSkill = [
                  { _from: 'biz_project/' + this.project_key },
                ];
                const _toUser = [
                  { _to: 'biz_project/' + this.project_key },
                ];
                this.userProjectService.removeSkill(_fromSkill);
                this.userProjectService.removeUserProejct(_toUser);                
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

  cancel(){
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
    if(this.mode === MODE.EDIT){
      title = this.translateService.translate('edit project')
    }
    else if(this.mode === MODE.NEW){
      title = this.translateService.translate('add project')
    }
    else{
      title = this.translateService.translate('view project')
    }
    return title;
  }

}