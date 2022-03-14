import { RESULT_STATUS } from '@ait/shared';
import { AitBaseComponent, AitEnvironmentService, AppState, AitAuthService, AitAppUtils } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserJobAlertService } from './../../../services/user-job-alert.service';
import { UserJobAlertDto } from './interface';

@Component({
  selector: 'ait-user-job-alert-detail',
  templateUrl: './user-job-alert-detail.component.html',
  styleUrls: ['./user-job-alert-detail.component.scss']
})
export class UserJobAlertDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserJobAlert = {} as UserJobAlertDto;
  industrys = [];
  experienceLevels = [];
  employeeTypes = [];
  locations = [];
  constructor(
    public activeRouter: ActivatedRoute,
    private userJobAlertService: UserJobAlertService,
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
      page: 'user_job_alert',
    });
  }

  async ngOnInit(): Promise<void> {
    const id = AitAppUtils.getParamsOnUrl(true);
    this.user_key = id;
    if (this.user_key) {
      await this.userJobAlertService
        .findUserJobAlert(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserJobAlert = data;
            const listIndustry = [];
            const listExperience = [];
            const listEmployees = [];
            const listLocations = [];
            data.industry.forEach((e) => listIndustry.push(e.value));
            this.industrys = listIndustry;
            data.experience_level.forEach((e) => listExperience.push(e.value));
            this.experienceLevels = listExperience;
            data.employee_type.forEach((e) => listEmployees.push(e.value));
            this.employeeTypes = listEmployees
            data.location.forEach((e) => listLocations.push(e.value));
            this.locations = listLocations;

          }

        })
    }
  }

  close(){
    history.back();
  }
}
