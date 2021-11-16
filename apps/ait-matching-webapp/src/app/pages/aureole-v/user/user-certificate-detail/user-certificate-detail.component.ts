import { RESULT_STATUS } from '@ait/shared';
import { AitBaseComponent, AitEnvironmentService, AppState, AitAuthService, AitAppUtils } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbLayoutScrollService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectDto } from '../user-certificate/certificate-interface';
import { UserCerfiticateService } from './../../../../services/user-certificate.service';


@Component({
  selector: 'ait-user-certificate-detail',
  templateUrl: './user-certificate-detail.component.html',
  styleUrls: ['./user-certificate-detail.component.scss']
})
export class UserCertificateDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserCertificate = {} as UserProjectDto;
  constructor(
    public activeRouter: ActivatedRoute,
    public certificateService: UserCerfiticateService,
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
      page: 'user_certificate',
    });
  }

  async ngOnInit(): Promise<void> {
    const id = AitAppUtils.getParamsOnUrl(true);
    this.user_key = id;
    if (this.user_key) {
      await this.certificateService
        .findUserByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserCertificate = data;
          }
        })
    }
  }

}
