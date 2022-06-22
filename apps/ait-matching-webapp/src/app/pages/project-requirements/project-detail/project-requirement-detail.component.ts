import { isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { AddRoleService } from '../../../services/add-role.service';
import { BizProjectService } from '../../../services/biz_project.service';
import { bizProjectDetail, bizProjectRequirement, bizProjectUser } from './projectRequirementInterface';

@Component({
  selector: 'ait-project-requirement-detail',
  templateUrl: './project-requirement-detail.component.html',
  styleUrls: ['./project-requirement-detail.component.scss'],
})
export class ProjectRequirementDetailComponent
  extends AitBaseComponent
  implements OnInit {
    project_key: string;
  dateFormat: string;
  project_skill = [];
  project_title = [];
  project_industry = [];
  project_level= [];
  project_location = [];
  isExpan = true;
  isTableExpan = true;
  projectRequiremant = {} as bizProjectRequirement;
  projectDetail = {} as bizProjectDetail;
  projectUser = {} as bizProjectUser;

  comboboxValue = ['location', 'title', 'level', 'industry'];
  constructor(
    public activeRouter: ActivatedRoute,
    private bizProjectService: BizProjectService,
    private addRoleService: AddRoleService,

    store: Store<AppState>,
    apollo: Apollo,
    env: AitEnvironmentService,
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
  }

  async ngOnInit(): Promise<void> {
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');
    await this.find();
    // this.callLoadingApp();
    console.log(1)
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
  
  async find() {
    try {
      await this.findProjectByKey();
      await this.findSkillProject();
      await this.findTitleProject();
      await this.findIndustryProject();
      await this.findLevelProject();
      await this.findLocationProject();
      await this.findProjectDetail();
    } catch (error) {
      console.log(error);
    }
  }

  async findProjectByKey() {
    const res = await this.bizProjectService.findProjectAitByKey(
      this.project_key
    );
    const data = res.data[0];
    if (res.data.length > 0) {
      this.projectRequiremant.name = data.name
      this.projectRequiremant.description = data.description
      this.projectRequiremant.remark = data.remark
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkillProject() {
    
    try {
      const _key = this.project_key;
      await this.bizProjectService
        .findSkillProject(_key)
        .then(async (res) => {
          const listSkills = res.data.map((m) => m?.skill.value);
          this.projectRequiremant.skill = listSkills
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findTitleProject() {
    try {
      const _key = this.project_key;
      await this.bizProjectService
        .findTitleProject(_key)
        .then(async (res) => {
          const listTitle = res.data.map((m) => m?.title.value);
          this.projectRequiremant.title = listTitle
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findIndustryProject() {
    try {
      const _key = this.project_key;
      await this.bizProjectService
        .findIndustryProject(_key)
        .then(async (res) => {
          const listIndustry = res.data.map((m) => m?.industry.value);
          this.projectRequiremant.industry = listIndustry
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findLevelProject() {
    try {
      const _key = this.project_key;
      await this.bizProjectService
        .findLevelProject(_key)
        .then(async (res) => {
          const listLevel = res.data.map((m) => m?.level.value);
          this.projectRequiremant.level = listLevel
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findLocationProject() {
    try {
      const _key = this.project_key;
      await this.bizProjectService
        .findLocationProject(_key)
        .then(async (res) => {
          const listLocation = res.data.map((m) => m?.location.value);
          this.projectRequiremant.location = listLocation
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findProjectDetail() {
    try{

      const result = await this.bizProjectService.findDetailByProject_key(
        this.project_key
        );
        const data = result.data[0];
        if (result.data.length > 0) {
          const user = await this.getEmployee(data.person_in_charge)
          this.projectDetail.customer = data.customer.value
          this.projectDetail.project_code = data.project_code
          this.projectDetail.status = data.status.value
          this.projectDetail.person_in_charge = user.value;
        }
      }catch {}
  }

  async getEmployee(_key: string) {
    const data = [];
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
          (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
      }
    });
    console.log(data)
    const user = data.find(u => u._key === _key)
    return user
  }

  
}
