import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  AitAuthService,
  AitAppUtils,
  getSettingLangTime,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogRef,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectDto } from '../user-project/interface';
import { UserProjectService } from './../../../services/user-project.service';
import { MatchingUtils } from '../../../@constants/utils/matching-utils';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-user-project-detail',
  templateUrl: './user-project-detail.component.html',
  styleUrls: ['./user-project-detail.component.scss'],
})
export class UserProjectDetailComponent
  extends AitBaseComponent
  implements OnInit {
  user_key: any = '';
  stateUserSkill: any;
  stateUserProject = {} as UserProjectDto;
  dateFormat: any;
  datas: any[] = [];

  constructor(
    public activeRouter: ActivatedRoute,
    private userProjectService: UserProjectService,
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

    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    await this.getMasterData();
  }

  async getMasterData() {
    try {
      if (!this.dateFormat) {
        const masterValue = await this.getUserSettingData('USER_SETTING');
        const setting = await this.findUserSettingCode();
        if (isObjectFull(setting) && isArrayFull(masterValue)) {
          const format = setting['date_format_display'];
          const data = masterValue.find((item) => item.code === format);
          if (data) {
            this.dateFormat = data['name'];
          }
        }
      }
    } catch (e) {}
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  public find = async (key = {}) => {
    if (isObjectFull(key)) {
      await this.userProjectService.find(this.user_key).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          const data = r.data[0];
          let dayFrom = '';
          let dayTo = '';
          this.stateUserProject = JSON.parse(JSON.stringify(data));
          if (this.stateUserProject['start_date_from']) {
            dayFrom = this.getDateFormat(
              this.stateUserProject['start_date_from']
            );
          }
          if (this.stateUserProject['start_date_to']) {
            dayTo = this.getDateFormat(this.stateUserProject['start_date_to']);
          }
          if (dayFrom && !dayTo) {
            this.stateUserProject['start_date'] = dayFrom;
          } else if (!dayFrom && dayTo) {
            this.stateUserProject['start_date'] = dayTo;
          } else if (dayFrom && dayTo) {
            this.stateUserProject['start_date'] = dayFrom + '  ~  ' + dayTo;
          } else {
            this.stateUserProject['start_date'] = '';
          }
        }
      });
      const from = 'biz_project/' + this.user_key;
      await this.userProjectService.findSkillsByFrom(from).then(async (res) => {
        const listSkills = res.data.map((m) => m?.skills.value);
        this.stateUserProject['skills'] = listSkills;
      });
    }
    const project = {};
    this.stateUserProject;
    for (const item in this.stateUserProject) {
      if (isObjectFull(this.stateUserProject[item])) {
        if (item == 'skills') {
          project[item] = this.stateUserProject[item];
        } else {
          project[item] = this.stateUserProject[item].value;
        }
      } else {
        project[item] = this.stateUserProject[item];
      }
    }
    this.datas.push(project);
    return { data: this.datas };
  };
}
