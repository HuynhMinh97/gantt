import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  AitAuthService,
  AitAppUtils,
  getSettingLangTime,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogRef,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProjectDto } from '../user-certificate/certificate-interface';
import { UserCerfiticateService } from './../../../services/user-certificate.service';
import dayjs from 'dayjs';
import { MatchingUtils } from '../../../@constants/utils/matching-utils';

@Component({
  selector: 'ait-user-certificate-detail',
  templateUrl: './user-certificate-detail.component.html',
  styleUrls: ['./user-certificate-detail.component.scss'],
})
export class UserCertificateDetailComponent
  extends AitBaseComponent
  implements OnInit {
  user_key: any = '';
  stateUserCertificate = {};
  dateFormat: any;
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

    this.store.pipe(select(getSettingLangTime)).subscribe((setting) => {
      if (setting) {
        const display = setting?.date_format_display;
        this.dateFormat = MatchingUtils.getFormatYearMonth(display);
      }
    });

    this.setModulePage({
      module: 'user',
      page: 'user_cerfiticate',
    });
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    this.getMasterData();
  }

  async getMasterData() {
    try {
      if (!this.dateFormat) {
        const masterValue = await this.getUserSettingData('USER_SETTING');
        const setting = await this.findUserSettingCode();
        if (isObjectFull(setting) && isArrayFull(masterValue)) {
          const format = setting['date_format_display'];
          const data = masterValue.find((item) => item.code === format);
          if (data) {
            this.dateFormat = data['name'];
          }
        }
      }
    } catch (e) {}
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  public find = async (key = {}) => {
    if (isObjectFull(key)) {
      return await this.certificateService
        .findUserByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserCertificate = JSON.parse(JSON.stringify(data));
            const datas = [];
            let dayFrom = '';
            let dayTo = '';
            if (this.stateUserCertificate['issue_date_from']) {
              dayFrom = this.getDateFormat(
                this.stateUserCertificate['issue_date_from']
              );
            }
            if (this.stateUserCertificate['issue_date_to']) {
              dayTo = this.getDateFormat(
                this.stateUserCertificate['issue_date_to']
              );
            }
            if (dayFrom && !dayTo) {
              this.stateUserCertificate['issue_date'] = dayFrom;
            } else if (!dayFrom && dayTo) {
              this.stateUserCertificate['issue_date'] = dayTo;
            } else if (dayFrom && dayTo) {
              this.stateUserCertificate['issue_date'] =
                dayFrom + '  ~  ' + dayTo;
            } else {
              this.stateUserCertificate['issue_date'] = '';
            }
            const certificate = {};
            for (const item in this.stateUserCertificate) {
              if (isObjectFull(this.stateUserCertificate[item])) {
                if (item == 'file') {
                  certificate[item] = this.stateUserCertificate[item];
                } else {
                  certificate[item] = this.stateUserCertificate[item].value;
                }
              } else {
                certificate[item] = this.stateUserCertificate[item];
              }
            }
            datas.push(certificate);
            return { data: datas };
          }
        });
    }
  };
}
