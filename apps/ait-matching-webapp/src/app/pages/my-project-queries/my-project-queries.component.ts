import {
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

@Component({
  selector: 'ait-project-list',
  templateUrl: './my-project-queries.component.html',
  styleUrls: ['./my-project-queries.component.scss'],
})
export class MyProjectQueriesComponent extends AitBaseComponent implements OnInit {
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

    this.setModulePage({
      module: '',
      page: '',
    });
  }
  ngOnInit(): void {
    this.callLoadingApp();
  }

  getOperator(key: string) {
    if (
      key === 'create_at_from' ||
      key === 'change_at_from' 
    ) {
      return OPERATOR.GREATER_OR_EQUAL;
    } else {
      return OPERATOR.LESS_OR_EQUAL;
    }
  }

  focusToTable() {
    try {
      setTimeout(() => {
        this.area.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 0);
    } catch {}
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
          } else {
            const isStr = isString(value);
            object[key] = {
              operator: isStr ? OPERATOR.LIKE : OPERATOR.IN,
            };
            if (isStr) {
              object[key]['valueAsString'] = value;
            } else {
              object[key]['value'] = this.getArrayKeys(value);
            }
          }
        }
      });

      if (isObjectFull(object)) {
        const data = await this.getData(object);
        this.focusToTable();
        return { data: data };
      } else {
        const data = await this.getData();
        this.focusToTable();
        return { data: data };
      }
    } else {
      const data = await this.getData();
      this.focusToTable();
      return { data: data };
    }
  };

  getArrayKeys(values: KeyValueDto | KeyValueDto[]) {
    const isArray = Array.isArray(values);
    const result = [];
    if (isArray) {
      ((values as KeyValueDto[]) || []).forEach((item) => {
        result.push(item._key);
      });
      return result;
    } else {
      result.push((values as KeyValueDto)._key);
      return result;
    }
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
  async getData(object?: any) {
    const dataSearch = [];
    await this.projectListService.find(object).then((res) => {
      if (res?.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach((element) => {
            const dataFormat = {};
            dataFormat['name'] = element?.name;
            dataFormat['_key'] = element?._key;
            dataFormat['code'] = element?.code;
            dataFormat['category'] = element?.category?.value;
            dataFormat['create_by'] = element?.create_by;
            dataFormat['change_by'] = element?.change_by;
            dataFormat['create_at'] = this.getDateFormat(element?.create_at);
            dataFormat['change_at'] = this.getDateFormat(element?.change_at);
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }

 
}
