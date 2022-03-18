import { JobSettingDto } from './../user-onboarding/interface';
import { RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserSkillsService } from '../../../services/user-skills.service';
import { UserOnboardingDto } from '../user-onboarding/interface';
import { UserOnboardingService } from './../../../services/user-onboarding.service';


@Component({
  selector: 'ait-user-onboarding-detail',
  templateUrl: './user-onboarding-detail.component.html',
  styleUrls: ['./user-onboarding-detail.component.scss']
})
export class UserOnboardingDetailComponent extends AitBaseComponent implements OnInit {
  user_key: any = '';
  stateUserOnboarding = {} as UserOnboardingDto;
  jobSettingInfo = {} as JobSettingDto;
  dataCountry: any;


  constructor(
    private formBuilder: FormBuilder,
    private userSkillsService: UserSkillsService,
    private router: Router,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
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
      page: 'user_onboarding',
    });

   
    
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    this.callLoadingApp();
    await this.userOnbService.findJobSetting(this.user_key).then((r) => {
      if (r.status === RESULT_STATUS.OK) {
        const jobSettingData = r.data[0];
        this.jobSettingInfo = jobSettingData;
      }
    });

    await this.userOnbService
      .findUserOnboardingByKey(this.user_key)
      .then(async (r) => {
        if (r.status === RESULT_STATUS.OK) {
          const data = r.data[0];
         this.stateUserOnboarding = data;
        }
      });
    
    setTimeout(() => {
      this.cancelLoadingApp();
    },500);
  }
 
  
}
