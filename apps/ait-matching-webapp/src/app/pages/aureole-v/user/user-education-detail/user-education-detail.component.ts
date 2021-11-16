import { RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserEducationService } from './../../../../services/user-education.service';
import { UserEducationDto } from '../user-education/interface';

@Component({
  selector: 'ait-user-education-detail',
  templateUrl: './user-education-detail.component.html',
  styleUrls: ['./user-education-detail.component.scss']
})
export class UserEducationDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserEducation = {} as UserEducationDto;
  constructor(
    public activeRouter: ActivatedRoute,
    private userEduService: UserEducationService,
    private route: ActivatedRoute,
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
      page: 'user_language',
    });
  }

  async ngOnInit(): Promise<void> {
    const id = AitAppUtils.getParamsOnUrl(true);
    this.user_key = id;
    if (this.user_key) {
      await this.userEduService
        .findUserEducationByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserEducation = data;
            console.log(this.stateUserEducation);

          }
        })
    }
  }

}
