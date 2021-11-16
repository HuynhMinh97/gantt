import { RESULT_STATUS } from '@ait/shared';
import { AitBaseComponent, AitEnvironmentService, AppState, AitAuthService, AitAppUtils } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectDto } from '../user-project/user-project/interface';
import { UserProjectService } from './../../../../services/user-project.service';


@Component({
  selector: 'ait-user-project-detail',
  templateUrl: './user-project-detail.component.html',
  styleUrls: ['./user-project-detail.component.scss']
})
export class UserProjectDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserSkill: any;
  stateUserProject = {} as UserProjectDto;
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

    this.setModulePage({
      module: 'user',
      page: 'user_project',
    });
  }

  async ngOnInit(): Promise<void> {
    const id = AitAppUtils.getParamsOnUrl(true);
    this.user_key = id;
    if (this.user_key) {
      await this.userProjectService
        .find(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserProject = data;
            console.log(this.stateUserProject);

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
  }


}
