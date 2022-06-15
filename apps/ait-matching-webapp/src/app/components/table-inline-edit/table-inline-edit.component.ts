import { isObjectFull, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { AddRoleService } from '../../services/add-role.service';
import { RegisterProjectService } from '../../services/register-project.service';

@Component({
  selector: 'ait-table-inline-edit',
  templateUrl: './table-inline-edit.component.html',
  styleUrls: ['./table-inline-edit.component.scss'],
})
export class TableInlineEditComponent
  extends AitBaseComponent
  implements OnInit {
  employeeList: any[] = [];
  isEdit = false;
  _key = '';
  list_candidate_perpage = [];
  list_candidate = [];
  list_candidate_clone = [];
  save_data = [];
  candidateEdit: FormGroup;
  current_page = 1;
  rows = 10;
  totalRows: number;
  listPage = [];
  start: number;
  end: number;

  @Input() project_key: string;
  dateFormat: string;

  constructor(
    private addRoleService: AddRoleService,
    private registerProjectService: RegisterProjectService,
    private formBuilder: FormBuilder,

    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
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

    this.candidateEdit = this.formBuilder.group({
      employee_name: new FormControl(null),
      _key: new FormControl(null),
      start_plan: new FormControl(null),
      end_plan: new FormControl(null),
      hours_plan: new FormControl(null),
      manday_plan: new FormControl(null),
      manmonth_plan: new FormControl(null),
      remark: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    const data = await this.getCandidate();
    await this.displayList(data, this.rows, this.current_page);
    await this.getEmployee();
  }

  handleClickEdit(_key: string) {
    this._key = _key;
    this.isEdit = true;
  }

  handleClickCancel() {
    this._key = null;
    this.isEdit = false;
  }

  handleFilterName(column_search: string, numberOfCol: number) {
    let td, i, txtValue;
    const input = <HTMLInputElement>document.getElementById(column_search);
    const filter = input.value.toLowerCase();
    const table = document.getElementById('candidate_table');
    const tr = table.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[numberOfCol];
      if (td) {
        txtValue = td.children[0].textContent || td.children[0].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = '""';
          tr[i].removeAttribute('style');
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

  async onChangeRowPerpage(row) {
    this.rows = row;
    this.end = 0;
    await this.displayList(this.list_candidate, row, 1);
  }

  handleClickSave() {
    const data_save = this.candidateEdit.value;
    data_save['employee_name'] = data_save['employee_name'].value;
    data_save['user_id'] = this.candidateEdit.controls[
      'employee_name'
    ].value._key;
    data_save['start_plan_format'] = this.getDateFormat(
      data_save['start_plan']
    );
    data_save['end_plan_format'] = this.getDateFormat(data_save['end_plan']);
    this.list_candidate_clone = this.list_candidate_perpage;
    this.save_data = this.list_candidate;
    this.list_candidate_clone.forEach((item, index) => {
      if (item._key == data_save._key) {
        this.list_candidate_perpage[index] = data_save;
        return true;
      }
    });
    this.save_data.splice(this.start, this.end, ...this.list_candidate_perpage);
    this.registerProjectService.data_save = this.save_data;
    this.isEdit = false;
  }

  async getCandidate(): Promise<any[]> {
    const result = await this.registerProjectService.getBizProjectUser(
      this.project_key
    );
    const candidates = result.data;
    candidates.forEach((item) => {
      const data = {};
      Object.keys(item).forEach((key) => {
        if (key.includes('start') || key.includes('end')) {
          const value = this.getDateFormat(item[key]);
          data[key + '_format'] = value;
          data[key] = item[key];
        } else {
          const value = item[key];
          data[key] = value;
        }
        data['employee_name'] = item['first_name'] + ' ' + item['last_name'];
      });
      this.list_candidate.push(data);
      this.totalRows = this.list_candidate.length;
    });
    const totalPage = Math.ceil(this.totalRows / this.rows);
    for (let i = 1; i <= totalPage; i++) {
      this.listPage.push(i);
    }
    return this.list_candidate;
  }

  async displayList(data, row_per_page, page) {
    this.list_candidate_perpage = [];
    this.current_page = page;
    this.start = row_per_page * (page - 1);
    this.end = this.start + row_per_page;
    if (this.end > this.list_candidate.length) {
      this.end = this.list_candidate.length;
    }
    const arr = data;
    const paginatedItems = arr.slice(this.start, this.end);

    for (let i = 0; i < paginatedItems.length; i++) {
      const item = paginatedItems[i];
      this.list_candidate_perpage.push(item);
    }
    console.log(this.end);
  }

  async clickPageNumber(page) {
    await this.displayList(this.list_candidate, this.rows, page);
  }

  async getEmployee() {
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [];
        (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
        this.employeeList = data;
      }
    });
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.candidateEdit.controls[form].markAsDirty();
      this.candidateEdit.controls[form].setValue(value);
    } else {
      this.candidateEdit.controls[form].setValue(null);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.candidateEdit.controls[form].markAsDirty();
      this.candidateEdit.controls[form].setValue(value[0]);
    } else {
      this.candidateEdit.controls[form].setValue(null);
    }
  }

  takeInputNumberValue(value: any, group: string, form: string) {
    if (value !== '' && value !== null && !isNaN(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(Number(value));
    } else {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    } else {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
  }

  

  calculaHoursDayMonthPlan( group: string, form_control: string) {
    let remain_form_control1 = '';
    let remain_form_control2 = '';
    let remain_property1: number
    let remain_property2: number
    const input = <HTMLInputElement>(
      document.getElementById(`${form_control}_input_number`)
    );
    const input_value = input.value;
    if (form_control === 'hours_plan') {
      remain_form_control1 = 'manday_plan';
      remain_form_control2 = 'manmonth_plan';
      remain_property1 = Math.round(Number(input_value) / 8 * 1000)/1000;
      remain_property2 =  Math.round(Number(input_value) / 160 * 1000)/1000;
    }
    if (form_control === 'manday_plan') {
      remain_form_control1 = 'hours_plan';
      remain_form_control2 = 'manmonth_plan';
      remain_property1 = Number(input_value) * 8;
      remain_property2 = Math.round(Number(input_value) / 20 * 1000)/1000;
    }
    if (form_control === 'manmonth_plan') {
      remain_form_control1 = 'hours_plan';
      remain_form_control2 = 'manday_plan';
      remain_property1 = Number(input_value) * 160;
      remain_property2 = Number(input_value) * 20;
    }
    const remain_property_plan1 = <HTMLInputElement>(
      document.querySelector(`#${remain_form_control1}_input_number`)
    );
    remain_property_plan1.value = String(remain_property1);
    const remain_property_plan2 = <HTMLInputElement>(
      document.querySelector(`#${remain_form_control2}_input_number`)
    );
    remain_property_plan2.value = String(remain_property2);

    this[group].controls[form_control].markAsDirty();
    this[group].controls[remain_form_control1].markAsDirty();
    this[group].controls[remain_form_control2].markAsDirty();
    this[group].controls[form_control].setValue(input_value);
    this[group].controls[remain_form_control1].setValue(remain_property1);
    this[group].controls[remain_form_control2].setValue(remain_property2);
  }
}
