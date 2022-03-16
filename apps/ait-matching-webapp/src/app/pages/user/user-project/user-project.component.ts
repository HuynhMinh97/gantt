import { 
  AitAppUtils, 
  AitAuthService, 
  AitBaseComponent, 
  AitConfirmDialogComponent,
  AitEnvironmentService, 
  AitTranslationService, 
  AitUserService, 
  AppState, 
  getSettingLangTime, 
  MODE 
} from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { select, Store} from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectErrorsMessage } from './interface';
import { isArrayFull, isObjectFull, KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { UserProjectService } from '../../../services/user-project.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { MatchingUtils } from '../../../../app/@constants/utils/matching-utils';
@Component({
  selector: 'ait-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent extends AitBaseComponent implements OnInit {
  mode = MODE.NEW;
  listSkills: any;
  dateFormat: any;
  userProjectClone: any;
  projectDataInput: any;
  userProject: FormGroup;
  dateNow = new Date().setHours(0, 0, 0, 0);
  userProjectErros = new UserProjectErrorsMessage();
  isLoad = false;
  isSave = false;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  titleName = null;
  companyName = null;
  sort_no = 0;
  error = [];
 
  resetUserProject = {
    name: false,
    title: false,
    skills: false,
    achievement: false,
    description: false,
    start_date_to: false,
    company_working: false,
    responsibility: false,
    start_date_from: false,
  };
  isClearErrors = {
    name: false,
    title: false,
    skills: false,
    achievement: false,
    description: false,
    responsibility: false,
    company_working: false,
  };

  connection_user_project = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  }
  biz_project_skill = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };
 
  dateField = [
    'start_date_from',
    'start_date_to'
  ];
  project_key = '';
  constructor(
    public router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public authService: AitAuthService,
    public store: Store<AppState | any>,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userProjectService: UserProjectService,
    private translateService: AitTranslationService,
    private userProfileService: UserProfileService,

    // private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    apollo: Apollo,
    env: AitEnvironmentService,
    userService: AitUserService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
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
    this.store.pipe(select(getSettingLangTime)).subscribe(setting => {
      if (setting) {
        const display = setting?.date_format_display;
        this.dateFormat = MatchingUtils.getFormatYearMonth(display);
      }
    });
    this.setModulePage({
      module: 'user',
      page: 'user_project',
    });
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');

    this.userProject = this.formBuilder.group({
      _key: new FormControl(null),
      start_date_to: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      start_date_from: new FormControl(null, [Validators.required]),
      company_working: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      skills: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
      achievement: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
      responsibility: new FormControl(null, [Validators.required, Validators.maxLength(4000)]),
    });
  }

  async ngOnInit() {    
    this.callLoadingApp();
    setTimeout(() => {
      this.isLoad = true;
    }, 500);
    if (this.project_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode === 'NEW') {
      await this.inputProject();
      this.userProject.controls['title'].setValue(this.titleName);
      this.userProject.controls['start_date_from'].setValue(this.dateNow);
      this.userProject.controls['company_working'].setValue(this.companyName);
      this.userProjectClone = this.userProject.value;
      this.cancelLoadingApp();
    } else {
      await this.findBizProject();
      await this.findSkills();
      this.cancelLoadingApp();
    }
    await this.userProject.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    }); 
  }

  checkAllowSave() {
    const userInfoClone = { ...this.userProjectClone };
    const userInfo = { ...this.userProject.value };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }

  async findBizProject() {
    const res = await this.userProjectService.find(this.project_key);
    const data = res.data[0];    
    if (res.data.length > 0) {
      this.userProject.patchValue({ ...data });
      this.userProjectClone = this.userProject.value;
      this.companyName = this.userProject.value.company_working;
      this.titleName = this.userProject.value.title;
      if (data.user_id != this.user_id) {
        this.mode = MODE.VIEW;
      }
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkills() {
    const from = 'biz_project/' + this.project_key;
    await this.userProjectService.findSkillsByFrom(from)
    .then(async(res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push(skill?.skills);
      }    
        this.userProject.controls['skills'].setValue([...listSkills]);
        this.userProjectClone = this.userProject.value; 
    });    
  }

  async inputProject() {
    await this.userProjectService
      .findKeyDefault(this.user_id)
      .then((res) => {
        this.titleName = res.data[0].title;
        this.companyName = res.data[0].company_working;
      });
  }
  takeMasterValues(value: KeyValueDto[], group: string, form: string): void {
    if (isArrayFull(value)) {
      const data = [];
      value.forEach((file) => {
        data.push(file);
      });
      this.userProject.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
    }
  }
  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userProject.controls[target].markAsDirty();
      this.userProject.controls[target].setValue(value?.value[0]);
    } else {
      this.userProject.controls[target].setValue(null);
    }
  }

  takeInputValue(val: any, form: string): void {
    if (val) {
      this.userProject.controls[form].markAsDirty();
      this.userProject.controls[form].setValue(val);
    } else {
      this.userProject.controls[form].markAsDirty();
      this.userProject.controls[form].setValue(null);
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

  checkDatePicker() {
    const res = [];
    const msg = this.getMsg('E0004');
    const dateFrom = this.userProject.controls['start_date_from'].value;
    const dateTo = this.userProject.controls['start_date_to'].value;

    if (dateFrom > dateTo && dateTo != null) {
      const transferMsg = (msg || '')
        .replace('{0}', this.translateService.translate('date from'))
        .replace('{1}', this.translateService.translate('date to'));
      res.push(transferMsg);
    }
    return res;
  }

  getArrayData = (data: any[]) => {
    if (!data || data.length === 0) {
      return []
    }
    return Array.from(new Set(data.map(d => d?._key).filter(x => !!x)));
  }

  async Delete() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
          id:'delete-user-project',
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
              }
            });
          } else {
            this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
          }
        }
      });
  }

  cancel() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            style: {width: '90%'},
            title: this.getMsg('I0006'),
            id:'back-user-project',
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            this.closeDialog(false);
          }
        });
    } else {
      if(this.isSave){
        this.closeDialog(true);
      }else{
        this.closeDialog(false);
      }     
    }
  }

  getTitleByMode() {
    let title = '';
    if (this.mode === MODE.EDIT) {
      title = this.translateService.translate('edit project')
    }
    if (this.mode === MODE.NEW) {
      title = this.translateService.translate('add project')
    }
    return title;
  }

  closeDialog(event: boolean) {
    // this.nbDialogRef.close(event);
  }

  dataSaveProject(data: any) {
    const saveData = data
    saveData['user_id'] = this.authService.getUserID();
    this.listSkills = saveData.skills;
    delete saveData.skills;
    return saveData;
  }

  async saveSkill(bizProjectKey: string) {
    this.biz_project_skill._from = 'biz_project/' + bizProjectKey;
    this.biz_project_skill.relationship = ' biz_project_skill';
    if (this.mode == 'EDIT') {
      const _fromSkill = [
        { _from: 'biz_project/' + this.project_key },
      ];
      this.userProjectService.removeSkill(_fromSkill);
    }
    for(const skill of this.listSkills){
      await this.userProjectService.findMSkillsByCode(skill)
        .then(async (res) => {
          this.sort_no += 1;
          this.biz_project_skill.sort_no = this.sort_no;
          this.biz_project_skill._to = 'm_skill/' + res.data[0]._key;
          await this.userProjectService.saveSkills(this.biz_project_skill);
        });
    }
  }

  async saveUserProject(bizProjectKey: string) {
    this.connection_user_project._from = 'sys_user/' + this.user_id;
    this.connection_user_project._to = 'biz_project/' + bizProjectKey;
    this.connection_user_project.relationship = 'user project';
    this.connection_user_project.sort_no = this.sort_no + 1;
    await this.userProjectService.saveConnectionUserProject(this.connection_user_project);
  }


  public save = async (data = {}) => {
    try {
      return await this.userProjectService.saveBizProject(this.dataSaveProject(data))
        .then(async (res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const data = res.data[0];
            await this.saveUserProject(data._key);
            await this.saveSkill(data._key);
            return res;
          } 
        })
    } catch (error) {
      console.log(error);
      
    }
    
  }
  public find = async (data = {}) => {
    try {
      const dataFind = [];
      if (this.mode === 'NEW') {
        await this.inputProject();
        this.userProject.controls['title'].setValue(this.titleName);
        this.userProject.controls['start_date_from'].setValue(this.dateNow);
        this.userProject.controls['company_working'].setValue(this.companyName);
        console.log( this.userProject.value);
        
      } else {
        await this.findBizProject();
        await this.findSkills();
        this.cancelLoadingApp();
        console.log( this.userProject.value);
      }
      dataFind.push(this.userProject.value);
      return {data: dataFind }
    } catch (error) {
      console.log(error);
      
    }
    
  }
  public delete = async (data = '') => {
    try {
      return await this.userProjectService.remove(data).then((res) => {
        if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
          const _fromSkill = [
            { _from: 'biz_project/' + this.project_key },
          ];
          const _toUser = [
            { _to: 'biz_project/' + this.project_key },
          ];
          this.userProjectService.removeSkill(_fromSkill);
          this.userProjectService.removeUserProejct(_toUser);
          // this.userProfileService.onLoad.next(this.projectDataInput);
          return res;
        } 
      });
    } catch (error) {
      console.log(error);
      
    }
    
  }
}