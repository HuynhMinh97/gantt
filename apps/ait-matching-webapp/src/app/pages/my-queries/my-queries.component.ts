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
import { MyQueriesService } from '../../services/my-queries.service';

@Component({
  selector: 'ait-project-list',
  templateUrl: './my-queries.component.html',
  styleUrls: ['./my-queries.component.scss'],
})
export class MyQueriesComponent
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
    'valid_time_to',
    'valid_time_from'
  ];
  userAttribute = ['create_by', 'change_by'];
  comboboxSearch = ['industry', 'title', 'location', 'level', 'skill'];

  constructor(
    private myQueriesService: MyQueriesService,
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
      project_ait_name: new FormControl(null),
      industry: new FormControl(null),
      title: new FormControl(null),
      location: new FormControl(null),
      level: new FormControl(null),
      skill: new FormControl(null),
      valid_time_from: new FormControl(null),
      valid_time_to: new FormControl(null),
      create_by: new FormControl(null),
      change_by: new FormControl(null),
      change_at_from: new FormControl(null),
      change_at_to: new FormControl(null),
      create_at_from: new FormControl(null),
      create_at_to: new FormControl(null),
    });

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }

  ngOnInit(): void {
    this.callLoadingApp();
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

  getOperator(key: string) {
    if (key === 'create_at_from' || key === 'change_at_from' || key === 'valid_time_from') {
      return OPERATOR.GREATER_OR_EQUAL;
    } else {
      return OPERATOR.LESS_OR_EQUAL;
    }
  }
  
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  async getData(obj?: any) {
    const dataSearch = [];
    await this.myQueriesService.searchProjectCompany(obj).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['industry'] = element?.industry?.value;
            dataFormat['title'] = element?.title?.value;
            dataFormat['level'] = element?.level?.value;
            dataFormat['location'] = element?.location?.value;
            dataFormat['skill'] = element?.skill;
            dataFormat['_key'] = element?._key;
            dataFormat['project_ait_name'] = element?.project_ait_name;
            dataFormat['create_by'] = element?.create_by;
            dataFormat['change_by'] = element?.change_by;
            dataFormat['create_at'] = this.getDateFormat(element?.create_at);
            dataFormat['change_at'] = this.getDateFormat(element?.change_at);
            if( element?.valid_time_to) {
              const valid_time = this.getDateFormat(element?.valid_time_from) + ' - ' + this.getDateFormat(element?.valid_time_to);
              dataFormat['valid_time'] = valid_time;
            } else {
              const valid_time = this.getDateFormat(element?.valid_time_from);
              dataFormat['valid_time'] = valid_time;
            }
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }

  public search = async (condition = {}, data = {}) => {
    this.searchProject.patchValue({ ...data });
    if (
      this.searchProject.valid &&
      !this.isChangeAtError &&
      !this.isCreateAtError
    ) {
      const object = {};
      Object.keys(this.searchProject.controls).forEach((key) => {
        const value = this.searchProject.controls[key].value;
        if (value) {
          if (this.dateAtributes.includes(key)) {
            object[key] = {
              target: key.slice(0, 9) || '',
              operator: this.getOperator(key),
              valueAsNumber: value,
            };
          } else if (this.userAttribute.includes(key)) {
            try {
              if (!object[key]) {
                object[key] = { operator: OPERATOR.LIKE };
              }
              object[key]['value'] = value;
            } catch (e) {}
          } else if (this.comboboxSearch.includes(key)) {
            try {
              if (!object[key]) {
                object[key] = { operator: OPERATOR.LIKE };
              }
              if(key == 'skill') {
                object[key]['value'] = value.value;
              }else {
                object[key]['value'] = value._key;
              }
              const isStr = isString(value);
              object[key]['operator'] = isStr ? OPERATOR.LIKE : OPERATOR.IN;
            } catch (e) {}
          }else {
            const isStr = isString(value);
            object[key] = {
              operator: isStr ? OPERATOR.LIKE : OPERATOR.IN,
            };
            if (isStr) {
              object[key]['valueAsString'] = value;
            }
          }
        }
      });
     
      
      if (isObjectFull(object)) {
        const data = await this.getData(object);
        return { data: data };
      } else {
        const data = await this.getData();
        return { data: data };
      }
    } else {
      const data = await this.getData();
      return { data: data };
    }
  }
}
