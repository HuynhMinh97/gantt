import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AitMasterDataService, AitTranslationService, AitUserService, AppState, getCaption, getLang, MODE } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
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
  loading = false;
  mode = MODE.NEW;
  isChanged = false;
  isSubmit = false;
  userProject: FormGroup;
  currentLang = '';
  job_company: any = '';
  userProjectClone: any;
  isReset = false;
  private userProjectSubscr: Subscription;
  dateNow = Date.now();
  defaultCompany = {} as KeyValueDto;
  keyTitle = '';
  keyCompany = '';
  keyBizProject='';
  error = null;
  listSkills = [];
  stateProjectInfo = {} as UserProjectDto;
  stateProjectInfoDf = {} as UserProjectDto;
  isCheckSave = false;
  connection_user_project = {
    _from:'',
    _to:'',
    del_flag: false
  }

  resetUserProject = {
    name: false,
    start_date_from: false,
    start_date_to: false,
    company: false,
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
  isClearErrors = false;
  constructor(
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    public router: Router,
    private userProjectService: UserProjectService,
    private masterDataService: AitMasterDataService,
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
      module: 'matching',
      page: 'user_education',
    });
    store.pipe(select(getLang)).subscribe((lang) => {
      this.currentLang = lang;
    });
    store.pipe(select(getCaption)).subscribe(() => {
      this.getI18n();
    })
    this.userProject = this.formBuilder.group({
      _key: new FormControl(null),
      name: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      start_date_from: new FormControl(null, [Validators.required]),
      start_date_to: new FormControl(null, [Validators.required]),
      company_working: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [ Validators.required ]),
      description: new FormControl(null, [Validators.maxLength(4000)]),
      skills: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      responsibility: new FormControl(null, [Validators.maxLength(4000)]),
      achievement: new FormControl(null, [Validators.maxLength(4000)]),
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
    }else{
      await this.findBizProject();
      this.userProject.valueChanges.subscribe((data) => {
        if (this.userProject.pristine) {
          this.userProjectClone = AitAppUtils.deepCloneObject(data);
        } else if (this.mode === MODE.EDIT) {
          this.checkAllowSave();
        }
      });
      
    }
  }

  async findBizProject(){
    const res = await this.userProjectService.find(this.project_key);
    const data = res.data[0];  
    if(res.data.length > 0 ){
      this.userProject.patchValue({ ...data });
      this.userProjectClone = this.userProject.value;
      this.listSkills = data.skills;
      console.log(this.userProject.value);      
    }else{
      this.showToastr('', this.getMsg('E0050'),'warning');
      history.back();
    }        
   
  }

  async inputProject(){
    await this.userProjectService
      .findKeyCompany(this.env.COMMON.COMPANY_DEFAULT)
      .then((r) => {
        this.keyCompany = r.data[0]._key;        
      })
    
    await this.userProjectService
      .findKeyTitle(this.env.COMMON.COMPANY_DEFAULT, this.user_id)
      .then((id) =>{
        this.keyTitle = id.data[0].title;
      });
  }

  takeDatePickerValue(value: number, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.userProject.controls[form].markAsDirty();
      this.userProject.controls[form].setValue(value);
      if(form == 'start_date_to'){
        this.error = this.checkDatePicker();
      }
    } else {
      this.userProject.controls[form].setValue(null);
    }
    
  }

  checkDatePicker(){
    const res = [];
    const msg = this.translateService.getMsg('E0004');
    const dateFrom = this.userProject.controls['start_date_from'].value;
    const dateTo = this.userProject.controls['start_date_to'].value;

    if(dateFrom > dateTo && dateTo != null){
      const transferMsg = (msg || '')
        .replace('{0}', 'start date from ')
        .replace('{1}','start date to');
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
    saveData.skills =  this.getArrayData(saveData['skills']);
    return saveData;
  }

  async save(){
    this.isSubmit = true;
    // lay danh sach skills da chon
    let listMSkills = [];
    let listKeySkills = [];
    this.userProject.value.skills.forEach(element => {      
      listKeySkills.push(element._key)
    });    
    // luu data vao biz_project 
    await this.userProjectService.save(this.dataSaveProject(),'biz_project' )
    .then((res) => {  
      if (res?.status === RESULT_STATUS.OK) {
        const data = res.data[0];
        let keyBizProject = 'biz_project/' + data._key;
        listKeySkills.forEach(element => {
          let  userProjectSkills = {
            _from:'',
            _to:'',
            del_flag: false
          } 
          userProjectSkills._from = keyBizProject;
          userProjectSkills._to = 'm_skill/' + element;
          listMSkills.push(userProjectSkills);
        });

        this.connection_user_project._from = 'sys_user/' + this.user_id;
        this.connection_user_project._to = keyBizProject;
        this.isCheckSave = true;
      }      
    }).catch(() => {
      this.isCheckSave = false;
      return;
    })
    // end save biz_project

    if(this.mode === 'NEW' && this.isCheckSave){
      //luu ds cac skill vao bang biz_project_skills
      listMSkills.forEach(async element => {
        await this.userProjectService.save(element,'biz_project_skill');
      });

      await this.userProjectService.save(
        this.connection_user_project,'connection_user_project'
      );
    }

    if(this.mode === 'EDIT' && this.isCheckSave){
      let fromBizProjectSkills = 'biz_project/' + this.project_key;
      await this.userProjectService.findKey(fromBizProjectSkills,'','biz_project_skill')
      .then( (r) => {
        r.data.forEach(async element => {
          await  this.userProjectService.delete(element._key, 'biz_project_skill')
        .then((t) =>{
         });  
        });       
      })

      //luu ds cac skill vao bang biz_project_skills
      listMSkills.forEach(async element => {
        await this.userProjectService.save(element,'biz_project_skill');
      });
    }
    
  }

  async saveContinue() { 
    this.isSubmit = true; 
    if(!this.userProject.valid){
      setTimeout(() =>{
        this.isSubmit = false; 
        return;
      },1000)
    }else{
      await this.save();
      if(this.isCheckSave){ 
        this.showToastr('', this.getMsg('I0001'),'success');
        this.router.navigateByUrl('/user-project');
      }else{
        this.showToastr('', this.getMsg('E0100'),'warning');
      }        
      await this.reset();
      setTimeout(() => { 
        this.isReset = false;
        this.userProject.controls["start_date_from"].setValue(this.dateNow);
        this.userProject.controls['title'].setValue( this.keyTitle);
        this.userProject.controls['company_working'].setValue(this.keyCompany);
      }, 100);
      setTimeout(() =>{
      },1000)
    }   
  }

  async saveClose(){
    this.isSubmit = true; 
    if(!this.userProject.valid){
      setTimeout(() =>{
        this.isSubmit = false; 
        return;
      },1000)
      
    }else{
      await this.save();
      if(this.isCheckSave && this.mode === 'NEW'){
        this.showToastr('', this.getMsg('I0001'),'success');
        this.router.navigate([`/recommenced-user`]);
      }else if(this.isCheckSave && this.mode === 'EDIT'){
        this.showToastr('', this.getMsg('I0002'),'success');
        this.router.navigate([`/recommenced-user`]);
      }else{
        this.showToastr('', this.getMsg('E0100'),'warning');
      }
    }
   
  }

  takeInputValue(val: any, form: string): void {     
    if (val) {
      if(isObjectFull(val)){  
        if (form = 'skills') {          
          const data = [];       
          val.value.forEach((item) => {
            data.push(item);
          });
          this.userProject.markAsDirty();
          this.userProject.controls['skills'].setValue(data);
        }else{
          this.userProject.controls[form].setValue(val?.value[0]?._key);
        }     
      } 
      else {
        this.userProject.controls[form].markAsDirty();
        this.userProject.controls[form].setValue(val);
      }  
    } else {
      this.userProject.controls[form].setValue(null);
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
    this.userProject.reset();
      for (const prop in this.resetUserProject) {
        this.resetUserProject[prop] = true;
        setTimeout(() => {
          this.resetUserProject[prop] = false;
        }, 100);
      }
  }

  async resetForm() {
    if (this.mode === MODE.EDIT) {
      const dataOld = this.userProjectClone;
      await this.reset();      
      setTimeout(() => {
        this.listSkills = dataOld.skills;
        this.userProject.patchValue({
          ...dataOld
        });
      },100)
    }
    else {
      await this.reset();
      setTimeout(() => { 
        this.isReset = false;
        this.userProject.controls["start_date_from"].setValue(this.dateNow);
        this.userProject.controls['title'].setValue( this.keyTitle);
        this.userProject.controls['company_working'].setValue(this.keyCompany);
        this.showToastr('', this.getMsg('I0007'));
      }, 100);
      this.resetErrors();
    }

    this.isClearErrors = true;
    setTimeout(() => {
      this.isClearErrors = false;
      this.showToastr('', this.getMsg('I0007'),'success');
    }, 300);
    
  }
  resetErrors(): void {
    this.userProjectErros = new UserProjectErrorsMessage();

  }
  remove() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('Bạn có muốn xóa dữ liệu này không?'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.onDelete();
        }
      });
  }

  async onDelete() {
    let fromSkills = 'biz_project/'+ this.project_key;
    let fromProject = 'sys_user/' + this.user_id;
    let toProject = 'biz_project/'+ this.project_key;
    let keyUser = '';
    let count = 0;
    let coutSkillsInBizProject = this.userProjectClone.skills.length;
    let fromBizProjectSkills = 'biz_project/' + this.project_key;
    let listKeyBizProjectSkills = [];

    await this.userProjectService.findKey(fromBizProjectSkills,'','biz_project_skill')
    .then((res) => {  
      if (res?.status === RESULT_STATUS.OK) {
        const data = res.data;
        if(data.length == coutSkillsInBizProject){
          res.data.forEach(element => {
            this.userProjectClone.skills.forEach(item => {
              let _toSkills = 'm_skill/' + item._key;
              if(element._to == _toSkills){
                count++;
              }
            });
            listKeyBizProjectSkills.push(element._key);
          });  
        }      
      }
    }).catch(() => {
      return;
    });

    await this.userProjectService.findKeyConnectionUserProject(fromProject,toProject)
    .then((r) => {
      if (r?.status === RESULT_STATUS.OK) {
        keyUser= r.data[0]._key;
      }
      
    }).catch(() => {
      return;
    });

    if(count == coutSkillsInBizProject && keyUser != ''){      
      const title = this.translateService.translate('c_10020');
      listKeyBizProjectSkills.forEach(async (element) =>{
        await this.userProjectService.delete(element,'biz_project_skill');
      });

      await this.userProjectService.delete(keyUser,'connection_user_project');
       

      await this.userProjectService.remove(this.project_key).then(res => {
        if (res.status === RESULT_STATUS.OK && res.data.length > 0) {    
          this.showToastr(title, this.getMsg('I0003'));
          history.back();
        } else {
          this.showToastr(title, this.getMsg('E0100'), KEYS.WARNING);
        }
      });      
    } else{
      this.showToastr('', this.getMsg('E0050'),'warning');
      // const title = this.translateService.translate('c_10020');
      // this.showToastr(title, this.getMsg('E0050'), KEYS.WARNING);
    }  
  }
  cancel(){
    if(this.isChanged){
      this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('I0006'),
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