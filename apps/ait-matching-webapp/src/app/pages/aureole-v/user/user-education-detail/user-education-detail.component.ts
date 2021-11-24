import { RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, getSettingLangTime } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserEducationService } from './../../../../services/user-education.service';
import { UserEducationDto } from '../user-education/interface';
import { MatchingUtils } from '../../../../@constants/utils/matching-utils';

@Component({
  selector: 'ait-user-education-detail',
  templateUrl: './user-education-detail.component.html',
  styleUrls: ['./user-education-detail.component.scss']
})
export class UserEducationDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserEducation = {} as UserEducationDto;
  dateFormat: any;
  constructor(
    private router: Router,
    private nbDialogRef: NbDialogRef<UserEducationDetailComponent>,
    public activeRouter: ActivatedRoute,
    private userEduService: UserEducationService,
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
      page: 'user_education',
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    if (this.user_key) {
      await this.userEduService
        .findUserEducationByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserEducation = data;
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
