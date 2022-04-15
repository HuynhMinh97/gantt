import {
  isArrayFull,
  isObjectFull,
  isString,
  KeyValueDto,
  OPERATOR,
  RESULT_STATUS,
} from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ProjectListService } from '../../services/project-list.service';
import dayjs from 'dayjs';
import { LocalDataSource } from 'ng2-smart-table';
import { SearchConditionService } from '../../services/search-condition.service';

@Component({
  selector: 'ait-project-list',
  templateUrl: './my-project-queries.component.html',
  styleUrls: ['./my-project-queries.component.scss'],
})
export class MyProjectQueriesComponent
  extends AitBaseComponent
  implements OnInit {
  @ViewChild('area') area: ElementRef;

  source: LocalDataSource;

  searchProject: FormGroup;
  isChangeAtError = false;
  isCreateAtError = false;
  dateFormat: string;
  empName: string;
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  userAttribute = ['create_by', 'change_by'];

  constructor(
    private projectListService: ProjectListService,
    private formBuilder: FormBuilder,

    store: Store<AppState>,
    apollo: Apollo,
    env: AitEnvironmentService,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
    private searchConditionService: SearchConditionService
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

    this.searchProject = this.formBuilder.group({
      username: new FormControl(null),
      name: new FormControl(null),
      category: new FormControl(null),
      // 登録者
      create_by: new FormControl(null),
      // 最終更新者
      change_by: new FormControl(null),
      // 最終更新日時
      change_at_from: new FormControl(null),
      change_at_to: new FormControl(null),
      // 登録日時
      create_at_from: new FormControl(null),
      create_at_to: new FormControl(null),
    });

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }

  getVales(data: KeyValueDto[]): string {
    if (isArrayFull(data)) {
      const result = [];
        data.forEach((element: KeyValueDto) => {
          result.push(element?.value ?? '');
        });
        return result.join(', ');
    } else {
      return '';
    }
  }

  public search = async (condition = {}, data = {}) => {
    const res = await this.searchConditionService.find();
    const resData: any[] = res.data || [];
    const nextData = [];
    resData.forEach(e => {
      const obj = {
        _key: e['_key'] || '',
        name: e['name'] || '',
        keyword: e['keyword'] || '',
        skills: this.getVales(e['skills']),
        current_job_title: this.getVales(e['current_job_title']),
        province_city: this.getVales(e['province_city']),
        industry_working: this.getVales(e['industry_working']),
        current_job_level: this.getVales(e['current_job_level']),
        valid_time_from: this.getDateFormat(e['valid_time_from']),
        valid_time_to: this.getDateFormat(e['valid_time_to']),
        create_at: this.getDateFormat(e['create_at']),
        create_by: e['create_by'],
        change_at: this.getDateFormat(e['change_at']),
        change_by: e['change_by']
      };
      nextData.push(obj);
    });
    return { data: nextData };
  };

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
}
