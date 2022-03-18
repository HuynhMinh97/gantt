import { RESULT_STATUS } from '@ait/shared';
import { AitBaseComponent, AitEnvironmentService, AppState, AitAuthService, AitAppUtils, getSettingLangTime } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectDto } from '../user-project/interface';
import { UserProjectService } from './../../../services/user-project.service';
import { MatchingUtils } from '../../../@constants/utils/matching-utils';

@Component({
  selector: 'ait-user-project-detail',
  templateUrl: './user-project-detail.component.html',
  styleUrls: ['./user-project-detail.component.scss']
})
export class UserProjectDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserSkill: any;
  stateUserProject = {} as UserProjectDto;
  dateFormat: any;

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

    this.user_key = this.activeRouter.snapshot.paramMap.get('id');

  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    if (this.user_key) {
      await this.userProjectService
        .find(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserProject = data;

          }
        });
      const from = 'biz_project/' + this.user_key;
      await this.userProjectService.findSkillsByFrom(from)
        .then(async (res) => {
          const listSkills = [];
          for (const skill of res.data) {
            listSkills.push(skill?.skills.value);
          }
          this.stateUserSkill = listSkills;
        })
    }
    setTimeout(() => {
      this.cancelLoadingApp();
    }, 500);
  }

}
