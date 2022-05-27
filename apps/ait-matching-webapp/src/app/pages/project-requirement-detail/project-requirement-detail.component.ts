import { isObjectFull } from '@ait/shared';
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
import { RegisterProjectService } from '../../services/register-project.service';

@Component({
  selector: 'ait-project-requirement-detail',
  templateUrl: './project-requirement-detail.component.html',
  styleUrls: ['./project-requirement-detail.component.scss'],
})
export class ProjectRequirementDetailComponent
  extends AitBaseComponent
  implements OnInit {
  _key: string;
  dateFormat: string;

  comboboxValue = ['location', 'title', 'level', 'industry'];
  constructor(
    public activeRouter: ActivatedRoute,
    private registerProjectService: RegisterProjectService,

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

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
  

  public find = async () => {
    const res = await this.registerProjectService.findProjectAitByKey(
      this._key
    );
    const dataForm = {
      data: [],
    };

    dataForm['data'][0] = {};
    Object.keys(res.data[0]).forEach((key) => {
      if (key === 'change_at' || key === 'create_at') {
        const value = res.data[0][key];
        dataForm['data'][0][key] = this.getDateFormat(value);
      } else if (key === 'active_flag') {
        const value = res.data[0][key];
        dataForm['data'][0][key] = value ? 'active' : 'inactive';
      } else if (this.comboboxValue.includes(key)) {
        const value = res.data[0][key];
        dataForm['data'][0][key] = value.value;
      } else {
        const value = res.data[0][key];
        dataForm['data'][0][key] = value;
      }
    });
    if (dataForm['data'][0]['valid_time_to']) {
      dataForm['data'][0]['valid_time'] =
        this.getDateFormat(dataForm['data'][0]['valid_time_from']) +
        ' - ' +
        this.getDateFormat(dataForm['data'][0]['valid_time_to']);
    } else {
      dataForm['data'][0]['valid_time'] = this.getDateFormat(
        dataForm['data'][0]['valid_time_from']
      );
    }
    await this.registerProjectService.findSkillProject(this._key).then(async (res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push(skill?.skills?.value);
      }
      if(listSkills.length > 0){
        dataForm['data'][0]['skills'] = listSkills.join(', ');
      }
    
      this.cancelLoadingApp();
    });
    dataForm['errors'] = res.errors;
    dataForm['message'] = res.message;
    dataForm['numData'] = res.numData;
    dataForm['numError'] = res.numError;
    dataForm['status'] = res.status;
    return dataForm;
  };
}
