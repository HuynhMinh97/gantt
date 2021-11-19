import { RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserOnboardingDto } from '../user-onboarding/interface';
import { UserOnboardingService } from './../../../../services/user-onboarding.service';


@Component({
  selector: 'ait-user-onboarding-detail',
  templateUrl: './user-onboarding-detail.component.html',
  styleUrls: ['./user-onboarding-detail.component.scss']
})
export class UserOnboardingDetailComponent extends AitBaseComponent implements OnInit {
  user_key: any = '';
  stateUserOnboarding = {} as UserOnboardingDto;
  constructor(
    private nbDialogRef: NbDialogRef<UserOnboardingDetailComponent>,
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
    if (this.user_key) {
      await this.userOnbService
        .findUserOnboardingByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserOnboarding = data;
          }
        })
    }
    setTimeout(() => {
      this.cancelLoadingApp();
    },500);
  }
  close(){
    this.closeDialog(false);
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
