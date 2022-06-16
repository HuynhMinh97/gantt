import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitSaveTempService,
  AitUserService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { BizProjectService } from '../../services/biz_project.service';
import dayjs from 'dayjs';
import { isObjectFull } from '@ait/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'ait-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss'],
})
export class RequirementListComponent
  extends AitBaseComponent
  implements OnInit {
  dateFormat: string;
  constructor(
    public bizProjectService: BizProjectService,
    private masterDataService: AitMasterDataService,
    store: Store<AppState | any>,
    apollo: Apollo,
    env: AitEnvironmentService,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
    saveTempService?: AitSaveTempService,
    router?: Router
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService,
      saveTempService,
      router
    );
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }

  ngOnInit(): void {
    this.callLoadingApp();
  }

  handleToSearch(_key: string) {
    _key && localStorage.setItem('biz_project_key', _key);
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  getSkills(list: any[]) {
    if (list.length > 0) {
      return list.map(({ value }) => value).join(', ');
    } else {
      return '';
    }
  }

  public search = async (condition = {}, data = {}) => {
    try {
      const res1 = await this.bizProjectService.find();
      const res2 = await this.bizProjectService.findDetail();
      const data = res1.data || [];
      const obj = {};
      obj['data'] = data.map((e: unknown) =>
        Object.assign({
          _key: e['_key'],
          name: e['name'],
          skills: this.getSkills(e['skills'] || []),
          status: '',
          create_at: this.getDateFormat(e['create_at']),
          create_by: e['create_by'],
          change_at: this.getDateFormat(e['change_at']),
          change_by: e['change_by'],
        })
      );
      return obj;
    } catch (e) {
      console.log(e);
    }
  };
}
