import { UserEducationService } from './../../../services/user-education.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isObjectFull, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-certificate-detail',
  templateUrl: './user-education-detail.component.html',
  styleUrls: ['./user-education-detail.component.scss'],
})
export class UserEducationDetailComponent
  extends AitBaseComponent
  implements OnInit {
  _key: string;
  dateFormat: string;

  constructor(
    public activeRouter: ActivatedRoute,
    private userEducationService: UserEducationService,

    store: Store<AppState>,
    apollo: Apollo,
    env: AitEnvironmentService,
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
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  public find = async (condition: any ) => {
    const result = await this.userEducationService
      .findUserEducationByKey(condition._key);
      const dataForm = {};
      Object.keys(result.data).forEach((key) => {
        const value = condition[key];
        dataForm['data'][key] = value;
      });
      dataForm['errors'] = result.errors;
      dataForm['message'] = result.message;
      dataForm['numData'] = result.numData;
      dataForm['numError'] = result.numError;
      dataForm['status'] = result.status;
      dataForm['data'] = result.data;

      console.log(dataForm)
      return dataForm;
  };
}
