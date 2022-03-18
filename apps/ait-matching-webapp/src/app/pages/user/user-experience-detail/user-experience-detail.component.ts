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
  ];

  startDateFrom: string;
  startDateto: string;
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

    this.setModulePage({
      module: 'user',
      page: 'user_experience',
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
            if (key === 'start_date_from' || key === 'start_date_to') {
              
              const value = result.data[0][key];
              if (value) {
                if(key.includes('_from')) {
                  this.startDateFrom = this.getDateFormat(value).substring(0,9);
                } else {
                  this.startDateto = this.getDateFormat(value).substring(0,9);
                }
              }
            } else {
              const value = result.data[0][key];
              dataForm['data'][0][key] = value;
            }
          }
        }
      });
      if (this.startDateto && this.startDateFrom) {
        dataForm['data'][0]['start_date'] = this.startDateFrom + ' ~ ' + this.startDateto
      } else {
        dataForm['data'][0]['start_date'] = this.startDateFrom
      }
      dataForm['errors'] = result.errors;
      dataForm['message'] = result.message;
      dataForm['numData'] = result.numData;
      dataForm['numError'] = result.numError;
      dataForm['status'] = result.status;
      console.log(dataForm);
      return dataForm;
    
  };
}

