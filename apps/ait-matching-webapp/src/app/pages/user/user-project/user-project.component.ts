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
  MODE,
} from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogService,
  NbDialogRef,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectErrorsMessage } from './interface';
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { UserProjectService } from '../../../services/user-project.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { MatchingUtils } from '../../../../app/@constants/utils/matching-utils';
import { UserOnboardingService } from '../../../services/user-onboarding.service';
@Component({
  selector: 'ait-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss'],
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
  keyEdit = '';

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
  };
  biz_project_skill = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };

  dateField = ['start_date_from', 'start_date_to'];
  project_key = '';
  constructor(
    public router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public authService: AitAuthService,
    public store: Store<AppState | any>,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
    private dialogService: NbDialogService,
    private userProjectService: UserProjectService,
    private translateService: AitTranslationService,
    private userProfileService: UserProfileService,

    // private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    apollo: Apollo,
    env: AitEnvironmentService,
    userService: AitUserService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
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
    this.store.pipe(select(getSettingLangTime)).subscribe((setting) => {
      if (setting) {
        const display = setting?.date_format_display;
        this.dateFormat = MatchingUtils.getFormatYearMonth(display);
      }
    });
    this.setModulePage({
      module: 'user',
      page: 'user_project',
    });

    this.project_key = this.activeRouter.snapshot.paramMap.get('id');

    this.userProject = this.formBuilder.group({
      _key: new FormControl(null),
      start_date_to: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      start_date_from: new FormControl(null, [Validators.required]),
      company_working: new FormControl(null, [Validators.required]),
      project_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      skills: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      achievement: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      responsibility: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4000),
      ]),
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  async ngOnInit() {
     this.callLoadingApp();
    
  }

  public find = async (data = {}) => {
    try {
      const dataFind = [];
      await this.findUserProjectByKey();
      await this.findSkillsByFrom();
      dataFind.push(this.userProject.value);
      return { data: dataFind };
    } catch (error) {}
  };

  public save = async (data = {}) => {
    try {
      return await this.userProjectService
        .saveBizProject(this.dataSaveProject(data))
        .then(async (res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const data = res.data[0];
            await this.saveUserProject(data._key);
            await this.saveUserSkill();
            // await this.saveSkill(data._key);
            return res;
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  public delete = async (data = '') => {
    try {
      return await this.userProjectService.remove(data).then((res) => {
        if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
          const _fromSkill = [{ _from: 'user_project/' + this.project_key }];
          const _toUser = [{ _to: 'biz_project/' + this.project_key }];
          this.userProjectService.removeSkill(_fromSkill);
          this.userProjectService.removeUserProejct(_toUser);
          // this.userProfileService.onLoad.next(this.projectDataInput);
          return res;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  async findUserProjectByKey() {
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

  async findSkillsByFrom() {
    const from = 'user_project/' + this.project_key;
    await this.userProjectService.findSkillsByFrom(from).then(async (res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push(skill?.skills);
      }
      this.userProject.controls['skills'].setValue([...listSkills]);
      this.userProjectClone = this.userProject.value;
    });
  }

  

  getArrayData = (data: any[]) => {
    if (!data || data.length === 0) {
      return [];
    }
    return Array.from(new Set(data.map((d) => d?._key).filter((x) => !!x)));
  };

  

  dataSaveProject(data: any) {
    this.keyEdit = data?._key;
    const saveData = data;
    saveData['user_id'] = this.authService.getUserID();
    this.listSkills = JSON.parse(JSON.stringify(saveData.skills));
    delete saveData.skills;
    return saveData;
  }
  async saveUserSkill() {
    const list_skill_copy = [...this.listSkills]
    const user_skill = await this.findSkills()
    user_skill.forEach(skill => {
     if (!this.listSkills.includes(skill._key)){
      list_skill_copy.push(skill._key);
     }
    })
    const saveData = {}
    const _fromSkill = [{ _from: 'sys_user/' + this.user_id }];
      await this.userOnbService.removeBizUserSkill(_fromSkill);
      saveData['_from'] = 'sys_user/' + this.user_id;
    for (const skill of list_skill_copy) {
      this.sort_no += 1;
      saveData['sort_no'] = this.sort_no;
      saveData['_to'] = 'm_skill/' + skill;
      await this.userOnbService.saveUserSkills([saveData]);
    }
    this.cancelLoadingApp();
  }

  async saveUserProject(bizProjectKey: string) {
    this.connection_user_project._from = 'sys_user/' + this.user_id;
    this.connection_user_project._to = 'user_project/' + bizProjectKey;
    this.connection_user_project.relationship = 'user project';
    this.connection_user_project.sort_no = this.sort_no + 1;
    await this.userProjectService.saveConnectionUserProject(
      this.connection_user_project
    );
  }

  async findSkills() {
    const from = 'sys_user/' + this.user_id;
    const listSkills = [];
    await this.userOnbService.findSkillsByFrom(from).then(async (res) => {
      for (const skill of res.data) {
        listSkills.push({
          _key: skill?.skills?._key,
          value: skill?.skills?.value,
          level: skill?.level,
        });
      }
    });
    return listSkills;
  }
}
