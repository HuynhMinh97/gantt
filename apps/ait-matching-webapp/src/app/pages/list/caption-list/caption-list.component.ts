import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { CaptionListService } from './../../../services/caption-list.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isObjectFull, isString, OPERATOR, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ait-caption-list',
  templateUrl: './caption-list.component.html',
  styleUrls: ['./caption-list.component.scss'],
})
export class CaptionListComponent extends AitBaseComponent implements OnInit {
  @ViewChild('area') area: ElementRef;
  dateFormat: string;
  source: LocalDataSource;
  searchCaption: FormGroup;
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  userAttribute = ['create_by', 'change_by'];
  comboboxSearch = ['module', 'page'];

  constructor(
    private captionListService: CaptionListService,
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

    this.searchCaption = this.formBuilder.group({
      name: new FormControl(null),
      module: new FormControl(null),
      page: new FormControl(null),
      code: new FormControl(null),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
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
    this.setModulePage({
      module: 'education_list',
      page: 'education_list',
    });
  }

  ngOnInit(): void {
    this.callLoadingApp();
    console.log(this.dateFormat);
  }

  getOperator(key: string) {
    if (key === 'create_at_from' || key === 'change_at_from') {
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
    await this.captionListService.searchCaption(obj).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['module'] = element?.module._key;
            dataFormat['page'] = element?.page._key;
            dataFormat['_key'] = element?._key;
            dataFormat['name'] = element?.name;
            dataFormat['code'] = element?.code;
            dataFormat['create_by'] = element?.create_by;
            dataFormat['change_by'] = element?.change_by;
            dataFormat['create_at'] = this.getDateFormat(element?.create_at);
            dataFormat['change_at'] = this.getDateFormat(element?.change_at);
            dataFormat['start_date'] = this.getDateFormat(
              element?.start_date_from
            );
            
              dataSearch.push(dataFormat);
           
          });
        }
      }
    });
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }

  public search = async (condition = {}, data = {}) => {
    this.searchCaption.patchValue({ ...data });
    if (this.searchCaption.valid) {
      const object = {};
      Object.keys(this.searchCaption.controls).forEach((key) => {
        const value = this.searchCaption.controls[key].value;
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
              object[key]['value'] = value.value;
              const isStr = isString(value);
              object[key]['operator'] = isStr ? OPERATOR.LIKE : OPERATOR.IN;
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
        this.focusToTable();
        return { data: data };
      } else {
        const data = await this.getData();
        this.focusToTable();
        return { data: data };
      }
    } else {
      const datas = await this.getData();
      this.focusToTable();
      return { data: datas };
    }
  };

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
}
