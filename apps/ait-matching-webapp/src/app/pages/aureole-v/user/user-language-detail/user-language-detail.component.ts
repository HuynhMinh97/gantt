import { UserLanguageService } from './../../../../services/user-language.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NbDialogRef,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { RESULT_STATUS } from '@ait/shared';
import { LanguageInfo } from './interface';

@Component({
  selector: 'ait-user-language-detail',
  templateUrl: './user-language-detail.component.html',
  styleUrls: ['./user-language-detail.component.scss']
})
export class UserLanguageDetailComponent extends AitBaseComponent implements OnInit {
  user_key: any = '';
  stateUserLanguage = {} as LanguageInfo;
  constructor(
    private nbDialogRef: NbDialogRef<UserLanguageDetailComponent>,
    public activeRouter: ActivatedRoute,
    private userLangService: UserLanguageService,
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
    if (this.user_key) {
      await this.userLangService
        .findUserLanguageByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserLanguage = data;
          }
        })
    }

  }
  close(){
    this.closeDialog(false);
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
