import { UserExperienceService } from './../../../services/user-experience.service';
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
  templateUrl: './user-experience-detail.component.html',
  styleUrls: ['./user-experience-detail.component.scss'],
})
export class UserExperienceDetailComponent
  extends AitBaseComponent
  implements OnInit {
  _key: string;
  dateFormat: string;
  combobox = ['title','company_working', 'employee_type', 'location'];
  dateAtributes = [
    'create_at',
    'change_at',
    'start_date_from',
    'start_date_to',
  ];

  constructor(
    public activeRouter: ActivatedRoute,
    private userExperienceService: UserExperienceService,

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
    const result = await this.userExperienceService
      .findUserExperienceByKey(condition._key);
      const dataForm = {
        data : []
      };
      
      dataForm['data'][0]={};
      Object.keys(result.data[0]).forEach((key) => {
        if(this.combobox.includes(key)) {
          const value = result.data[0][key].value;
        dataForm['data'][0][key] = value;
        } else {
          if(this.dateAtributes.includes(key)) {
            const value = result.data[0][key];
            dataForm['data'][0][key] = this.getDateFormat(value);
          }
          else {
            const value = result.data[0][key];
            dataForm['data'][0][key] = value;
          }
        }
      });
      dataForm['errors'] = result.errors;
      dataForm['message'] = result.message;
      dataForm['numData'] = result.numData;
      dataForm['numError'] = result.numError;
      dataForm['status'] = result.status;
      console.log(dataForm);
      return dataForm;
    
  };
}

