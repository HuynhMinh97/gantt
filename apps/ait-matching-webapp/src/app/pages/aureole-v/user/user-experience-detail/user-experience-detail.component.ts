import { MatchingUtils } from '../../../../@constants/utils/matching-utils';
import { RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, getSettingLangTime } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserExperienceService } from './../../../../services/user-experience.service';
import { UserExperienceDto } from '../user-experience/interface';

@Component({
  selector: 'ait-user-experience-detail',
  templateUrl: './user-experience-detail.component.html',
  styleUrls: ['./user-experience-detail.component.scss']
})
export class UserExperienceDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserExp = {} as UserExperienceDto;
  dateFormat: any;
  constructor(
    private nbDialogRef: NbDialogRef<UserExperienceDetailComponent>,
    public activeRouter: ActivatedRoute,
    private userExpService: UserExperienceService,
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
      page: 'user_experience',
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    if (this.user_key) {
      await this.userExpService
        .findUserExperienceByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserExp = data;
            console.log(this.stateUserExp);

          }
        })
    }
    setTimeout(() => {
      this.cancelLoadingApp();
    }, 500);
  }
  close(){
    this.closeDialog(false);
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
