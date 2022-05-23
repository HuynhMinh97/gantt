import { AddCaptionService } from './../../../../services/add-caption.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import dayjs from 'dayjs';
import { isObjectFull } from '@ait/shared';

@Component({
  selector: 'ait-caption-detail',
  templateUrl: './caption-detail.component.html',
  styleUrls: ['./caption-detail.component.scss'],
})
export class CaptionDetailComponent extends AitBaseComponent implements OnInit {
  _key: string;
  dateFormat: string;

  constructor(
    public activeRouter: ActivatedRoute,
    private addCaptionService: AddCaptionService,

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

  public find = async (condition: any) => {
    const skill = await this.addCaptionService.findCaptionByKey(condition._key);
    const dataForm = {
      data: [],
    };

    dataForm['data'][0] = {};
    Object.keys(skill.data[0]).forEach((key) => {
      if (key === 'change_at' || key === 'create_at') {
        const value = skill.data[0][key];
        dataForm['data'][0][key] = this.getDateFormat(value);
      } else if (key === 'name') {
        dataForm['data'][0]['en_US'] = skill.data[0]['name']['en_US'];
        dataForm['data'][0]['vi_VN'] = skill.data[0]['name']['vi_VN'];
        dataForm['data'][0]['ja_JP'] = skill.data[0]['name']['ja_JP'];
      } else {
        if(key === 'active_flag'){
          const value = skill.data[0][key];
            dataForm['data'][0][key] = value ? 'active' : 'inactive';
        } else {
          const value = skill.data[0][key];
          dataForm['data'][0][key] = value;
        }
      }
    });
    dataForm['errors'] = skill.errors;
    dataForm['message'] = skill.message;
    dataForm['numData'] = skill.numData;
    dataForm['numError'] = skill.numError;
    dataForm['status'] = skill.status;
    return dataForm;
  };
}
