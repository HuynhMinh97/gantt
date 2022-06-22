import { RegisterProjectService } from '../../../services/register-project.service';
import { UserOnboardingService } from '../../../services/user-onboarding.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
  MODE,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserListService } from '../../../services/user-list.service';
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import dayjs from 'dayjs';
import { AddRoleService } from '../../../services/add-role.service';
import { BizProjectService } from '../../../services/biz_project.service';
import { RecommencedUserService } from '../../../services/recommenced-user.service';

@Component({
  selector: 'ait-register-project',
  templateUrl: './register-project.component.html',
  styleUrls: ['./register-project.component.scss'],
})
export class RegisterProjectComponent
  extends AitBaseComponent
  implements OnInit {
  project_key: string;
  projectForm: FormGroup;
  project_skill = [];
  project_title = [];

  dateFormat: string;
  candidate_list = [];
  userProjectClone: any;
  tableComponents: any[] = [1];
  isTableIncluded = true;
  isExpandIncluded = true;
  isExpan = true;
  isTableExpan = true;
  user_list = [];
  employeeList: any[] = [];
  mode = MODE.NEW;

  constructor(
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
    private registerProjectService: RegisterProjectService,
    private userListService: UserListService,
    private addRoleService: AddRoleService,
    private bizProjectService: BizProjectService,
    private recommencedService: RecommencedUserService,

    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService
    );

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.projectForm = this.formBuilder.group({
      name: new FormControl(null),
      _key: new FormControl(null),
      location: new FormControl(null),
      title: new FormControl(null),
      valid_time_from: new FormControl(null),
      valid_time_to: new FormControl(null),
      level: new FormControl(null),
      industry: new FormControl(null),
      skills: new FormControl(null),
      description: new FormControl(null),
      remark: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.project_key) {
      this.mode = MODE.EDIT;
    }
    try {
      await this.getEmployee();
      await this.getAllUser();
    } catch {}

    this.cancelLoadingApp();
  }

  onCreateConfirm(event) {
    event.confirm.resolve();
  }

  onSaveConfirm(event) {
    event.confirm.resolve();
  }

  public find = async (data = {}) => {
    try {
      const dataFind = [];
      await this.findProjectByKey();
      await this.findSkillProject();
      await this.findTitleProject();
      await this.findIndustryProject();
      await dataFind.push(this.projectForm.value);

      return { data: dataFind };
    } catch (error) {}
  };

  async getCandidate() {
    const result = await this.registerProjectService.getBizProjectUser(
      this.project_key
    );
    this.candidate_list = result.data;
  }

  async findProjectByKey() {
    const res = await this.registerProjectService.findProjectAitByKey(
      this.project_key
    );
    const data = res.data[0];
    if (res.data.length > 0) {
      await this.projectForm.patchValue({ ...data });
      this.userProjectClone = this.projectForm.value;
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkillProject() {
    const _key = this.project_key;
    await this.registerProjectService
      .findSkillProject(_key)
      .then(async (res) => {
        const listSkills = [];
        for (const skill of res.data) {
          listSkills.push({
            _key: skill?.skills?._key,
            value: skill?.skills?.value,
          });
        }
        if (listSkills[0]['_key']) {
          this.project_skill = listSkills;
          await this.projectForm.controls['skills'].setValue([...listSkills]);
        }

        this.cancelLoadingApp();
      });
  }

  async findIndustryProject() {
    const _key = this.project_key;
    await this.registerProjectService
      .findIndustryProject(_key)
      .then(async (res) => {
        const listIndustry = [];
        for (const item of res.data) {
          listIndustry.push({
            _key: item?.industry?._key,
            value: item?.industry?.value,
          });
        }
        if (listIndustry[0]['_key']) {
          await this.projectForm.controls['industry'].setValue([
            ...listIndustry,
          ]);
        }
        this.cancelLoadingApp();
      });
  }

  async findTitleProject() {
    const _key = this.project_key;
    await this.registerProjectService
      .findTitleProject(_key)
      .then(async (res) => {
        const listTitles = [];
        for (const item of res.data) {
          listTitles.push({
            _key: item?.title?._key,
            value: item?.title?.value,
          });
        }
        if (listTitles[0]['_key']) {
          this.project_title = listTitles;
          await this.projectForm.controls['title'].setValue([...listTitles]);
        }
        this.cancelLoadingApp();
      });
  }

  toggleExpan = () => (this.isExpan = !this.isExpan);
  toggleTableExpan = () => (this.isTableExpan = !this.isTableExpan);

  async getAllUser() {
    const dataSearch = [];
    await this.userListService.find().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['title'] = element?.username;
            dataFormat['value'] = element?._key;
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.user_list = dataSearch;
    return dataSearch;
  }

  async getEmployee() {
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [];
        (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
        this.employeeList = data;
      }
    });
  }

  public save = async (condition = {}) => {
    const data = this.registerProjectService.data_save;
    await this.saveBizProject(condition);
  };

  async saveBizProject(condition) {
    try {
      const data = this.registerProjectService.data_save;
      const saveData = condition;
      if (!saveData['valid_time_to'] && saveData['valid_time_from']) {
        const start_plan = new Date(saveData['valid_time_from']);
        const end_plan = new Date(
          start_plan.getFullYear(),
          start_plan.getMonth() + 1,
          0
        );
        saveData['valid_time_to'] = end_plan.setMilliseconds(100);
      }
      this.bizProjectService.save(saveData).then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          const obj = {};
          this.registerProjectService
            .saveTeamMember(this.project_key)
            .then((r) => {
              if (r.status === RESULT_STATUS.OK) {
              }
            });
          this.showToastr('', this.getMsg('I0005'));
        } else {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
