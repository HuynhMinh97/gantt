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
import { RegisterProjectService } from '../../../services/register-project.service';
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
    private registerProjectService: RegisterProjectService,
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
    this.callLoadingApp();
    await this.find();
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
  
  async find(data = {}) {
    try {
      const dataFind = [];
      await this.findProjectByKey();
      await this.findSkillProject();
      await this.findTitleProject();
      await this.findIndustryProject();
      await this.findLevelProject();
      await this.findLocationProject();
      await this.findProjectDetail();
    } catch (error) {}
  }

  async findProjectByKey() {
    const res = await this.registerProjectService.findProjectAitByKey(
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
      await this.registerProjectService
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
      await this.registerProjectService
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
      await this.registerProjectService
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
      await this.registerProjectService
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
      await this.registerProjectService
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
    debugger
    const result = await this.bizProjectService.findDetailByProject_key(
      this.project_key
    );
    const data = result.data[0];
    if (result.data.length > 0) {
      
      const user = this.getEmployee(data.person_in_charge)
      this.projectDetail.customer = data.customer.value
      this.projectDetail.project_code = data.project_code
      this.projectDetail.status = data.status.value
    }
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
    return data.find(u => u._key === _key).full_name
  }

  // public find = async () => {
  //   const res = await this.registerProjectService.findProjectAitByKey(
  //     this._key
  //   );
  //   const dataForm = {
  //     data: [],
  //   };

  //   dataForm['data'][0] = {};
  //   Object.keys(res.data[0]).forEach((key) => {
  //     if (key === 'change_at' || key === 'create_at') {
  //       const value = res.data[0][key];
  //       dataForm['data'][0][key] = this.getDateFormat(value);
  //     } else if (key === 'active_flag') {
  //       const value = res.data[0][key];
  //       dataForm['data'][0][key] = value ? 'active' : 'inactive';
  //     } else if (this.comboboxValue.includes(key)) {
  //       const value = res.data[0][key];
  //       dataForm['data'][0][key] = value.value;
  //     } else {
  //       const value = res.data[0][key];
  //       dataForm['data'][0][key] = value;
  //     }
  //   });
  //   if (dataForm['data'][0]['valid_time_to']) {
  //     dataForm['data'][0]['valid_time'] =
  //       this.getDateFormat(dataForm['data'][0]['valid_time_from']) +
  //       ' - ' +
  //       this.getDateFormat(dataForm['data'][0]['valid_time_to']);
  //   } else {
  //     dataForm['data'][0]['valid_time'] = this.getDateFormat(
  //       dataForm['data'][0]['valid_time_from']
  //     );
  //   }
  //   await this.registerProjectService.findSkillProject(this._key).then(async (res) => {
  //     const listSkills = [];
  //     for (const skill of res.data) {
  //       listSkills.push(skill?.skills?.value);
  //     }
  //     if(listSkills.length > 0){
  //       dataForm['data'][0]['skills'] = listSkills.join(', ');
  //     }
    
  //     this.cancelLoadingApp();
  //   });
  //   dataForm['errors'] = res.errors;
  //   dataForm['message'] = res.message;
  //   dataForm['numData'] = res.numData;
  //   dataForm['numError'] = res.numError;
  //   dataForm['status'] = res.status;
  //   return dataForm;
  // };
}
