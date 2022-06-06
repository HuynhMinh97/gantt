import { MasterListService } from '../../../services/master-list.service';
import { Apollo } from 'apollo-angular';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { isObjectFull, isString, OPERATOR, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss'],
})
export class MasterListComponent extends AitBaseComponent implements OnInit {
  source: LocalDataSource;
  dateFormat: string;
  searchMaster: FormGroup;

  collections = [];

  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  userAttribute = ['create_by', 'change_by'];
  comboboxSearch = ['active_flag','collection' ];
  constructor(
    private formBuilder: FormBuilder,
    private masterListService: MasterListService,

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

    this.searchMaster = this.formBuilder.group({
      collection: new FormControl(null),
      name: new FormControl(null),
      active_flag: new FormControl(null),
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

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    try {
      await this.getMasterTableCollection();
    } catch {
      this.callLoadingApp();
    }
    this.callLoadingApp();

  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  getOperator(key: string) {
    if (key === 'create_at_from' || key === 'change_at_from') {
      return OPERATOR.GREATER_OR_EQUAL;
    } else {
      return OPERATOR.LESS_OR_EQUAL;
    }
  }

  async getData(obj?: any) {
    const dataSearch = [];
    for (const collection of this.collections) {
      await this.masterListService
        .searchRecordOfMaster(obj, collection)
        .then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            const data = res.data;
            if (data.length > 0) {
              data.forEach(async (element) => {
                const dataFormat = {};
                dataFormat['collection'] = element?._id.split('/', 1)[0];
                dataFormat['name'] = element?.name;
                dataFormat['status'] = element?.active_flag
                  ? 'active'
                  : 'inactive';
                dataFormat['_key'] = element?._key;
                dataFormat['create_by'] = element?.create_by;
                dataFormat['change_by'] = element?.change_by;
                dataFormat['create_at'] = this.getDateFormat(
                  element?.create_at
                );
                dataFormat['change_at'] = this.getDateFormat(
                  element?.change_at
                );
                dataSearch.push(dataFormat);
              });
            }
          }
        });
    }
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }

  public search = async (condition = {}, data = {}) => {
    this.searchMaster.patchValue({ ...data });
    if (this.searchMaster.valid) {
      const object = {};
      Object.keys(this.searchMaster.controls).forEach((key) => {
        const value = this.searchMaster.controls[key].value;
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
              if(key == 'active_flag') {
                const status = value.value === 'Active' ? true : false;
                object[key] = status
                const isStr = isString(value);
              object[key]['operator'] = isStr ? OPERATOR.LIKE : OPERATOR.IN;
              }
              if (key == 'collection') {
                
                object['_id'] = {valueAsString : value.value};
                object['_id']['operator'] = OPERATOR.LIKE;
              }
           
            } catch (e) {}
          } else {
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
  };

  async getMasterTableCollection () {
    const result = await this.masterListService.getMasterTable();
    const obj = result.data;
    obj.forEach(item => {
      this.collections.push(item.code)
    });
  }
}
