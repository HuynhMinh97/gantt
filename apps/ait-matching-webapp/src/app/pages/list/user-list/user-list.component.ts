import { LocalDataSource } from 'ng2-smart-table';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { isObjectFull, isString, OPERATOR, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';
import { log } from 'console';
import { UserListService } from '../../../services/user-list.service';

@Component({
  selector: 'ait-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends AitBaseComponent implements OnInit {
  @ViewChild('area') area: ElementRef;

  source: LocalDataSource;
  dateFormat: string;
  searchUser: FormGroup;
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  userAttribute = ['create_by', 'change_by'];
  constructor(
    private formBuilder: FormBuilder,
    private userListService: UserListService,
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

    this.searchUser = this.formBuilder.group({
      username: new FormControl(null),
      email: new FormControl(null),
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
      module: 'user',
      page: 'user-list',
    });
  }

  ngOnInit(): void {
    this.callLoadingApp();
  }

  getOperator(key: string) {
    if (key === 'create_at_from' || key === 'change_at_from') {
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

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  async getData(obj?: any) {
    
    const dataSearch = [];
    await this.userListService.find(obj).then((res) => {
      
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['username'] = element?.username;
            dataFormat['email'] = element?.email;
            dataFormat['_key'] = element?._key;
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

  public search = async (condition = {}, data = {}) => {
    this.searchUser.patchValue({ ...data });
    if (this.searchUser.valid) {
      const object = {};
      Object.keys(this.searchUser.controls).forEach((key) => {
        const value = this.searchUser.controls[key].value;
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
    }
    else {
      const datas = await this.getData();
      this.focusToTable();
      return { data: datas };
    }
  };
}
