import { CertificateListService } from './../../../services/certificate-list.service';
import { isObjectFull, isString, OPERATOR, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { LocalDataSource } from 'ng2-smart-table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ait-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
})
export class CertificateListComponent
  extends AitBaseComponent
  implements OnInit {
  @ViewChild('area') area: ElementRef;
  source: LocalDataSource;

  searchCertificate: FormGroup;

  dateFormat: string;
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
    'issue_date_from',
    'issue_date_to',
  ];
  userAttribute = ['create_by', 'change_by'];
  comboboxSearch = ['name', 'issue_by'];
  issue_date = 'issue_date_from';

  constructor(
    private certificateListService: CertificateListService,
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

    this.searchCertificate = this.formBuilder.group({
      employee_name: new FormControl(null),
      name: new FormControl(null),
      certificate_award_number: new FormControl(null),
      grade: new FormControl(null),
      issue_by: new FormControl(null),
      description: new FormControl(null),
      issue_date_from: new FormControl(null),
      issue_date_to: new FormControl(null),
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
      module: 'certificate_list',
      page: 'certificate_list',
    });
  }

  ngOnInit(): void {
    this.callLoadingApp();
  }

  getOperator(key: string) {
    if (
      key === 'create_at_from' ||
      key === 'change_at_from' ||
      key === 'issue_date_from' 
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

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  public search = async (condition = {}, data = {}) => {
    this.searchCertificate.patchValue({ ...data });
    if (this.searchCertificate.valid) {
      const object = {};
      Object.keys(this.searchCertificate.controls).forEach((key) => {
        const value = this.searchCertificate.controls[key].value;
        if (value) {
          if (this.dateAtributes.includes(key)) {
            if ( key === 'issue_date_from' || key === 'issue_date_to' ) {
              object[key] = {
                target: this.issue_date,
                operator: this.getOperator(key),
                valueAsNumber: value,
              };
            } else {
              object[key] = {
                target: key.slice(0, 9) || '',
                operator: this.getOperator(key),
                valueAsNumber: value,
              };
            }
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
              object[key]['value'] = value._key;
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

  async getData(obj?: any) {
    const dataSearch = [];
    await this.certificateListService.find(obj).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['employee_name'] =
              element.first_name + ' ' + element.last_name;
            dataFormat['certificate_name'] = element?.name;
            dataFormat['_key'] = element?._key;
            dataFormat['certificate_number'] =
              element?.certificate_award_number;
            dataFormat['description'] = element?.description;
            dataFormat['grade'] = element?.grade;
            dataFormat['issue_by'] = element?.issue_by.value;
            dataFormat['create_by'] = element?.create_by;
            dataFormat['change_by'] = element?.change_by;
            dataFormat['create_at'] = this.getDateFormat(element?.create_at);
            dataFormat['change_at'] = this.getDateFormat(element?.change_at);
            dataFormat['issue_at'] = this.getDateFormat(
              element?.issue_date_from
            );
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }
}
