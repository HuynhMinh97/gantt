import { isObjectFull } from '@ait/shared';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { EditDataMasterService } from '../../services/edit-data-master.service';

@Component({
  selector: 'ait-view-data-master',
  templateUrl: './view-data-master.component.html',
  styleUrls: ['./view-data-master.component.scss'],
})
export class ViewDataMasterComponent
  extends AitBaseComponent
  implements OnInit {
  _key: string;
  dateFormat: string;
  collections = [
    'm_certificate_award',
    'm_company',
    'm_industry',
    'm_project',
    'm_title',
    'm_training_center',
    'm_school',
    'm_skill',
  ];

  constructor(
    public activeRouter: ActivatedRoute,
    private editDataMasterService: EditDataMasterService,

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

  public find = async (_key: string) => {
    const condition = _key;

    let result;
    const Data = {};
    Data['data'] = [];
    Data['data'][0] = {};
    for (const collection of this.collections) {
      await this.editDataMasterService
        .getRecordOfMaster(condition, collection)
        .then((res) => {
          if (res.data[0]._id) {
            result = res.data[0];
            Data['data'][0]['name_en_US'] = res.data[0]?.name.en_US;
            Data['data'][0]['name_ja_JP'] = res.data[0]?.name.ja_JP;
            Data['data'][0]['name_vi_VN'] = res.data[0]?.name.vi_VN;
            Data['data'][0]['collection'] = res.data[0]?._id.split('/', 1)[0];
            Data['data'][0]['active_flag'] = res.data[0]?.active_flag ? 'active' : 'inactive';
            Data['data'][0]['create_by'] = res.data[0]?.create_by;
            Data['data'][0]['change_by'] = res.data[0]?.change_by;
            Data['data'][0]['create_at'] = this.getDateFormat(res.data[0]?.create_at);
            Data['data'][0]['change_at'] = this.getDateFormat(res.data[0]?.change_at);
            Data['errors'] = res.errors;
            Data['message'] = res.message;
            Data['numData'] = res.numData;
            Data['numError'] = res.numError;
            Data['status'] = res.status;
            
          }
        });
        if (Data['data'][0]['collection'])
        {
          break;
        }
    }

    return Data;
  };
}
