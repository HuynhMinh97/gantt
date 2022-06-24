import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { AddRoleService } from '../../services/add-role.service';
import { BizProjectService } from '../../services/biz_project.service';
import { RecommencedUserService } from '../../services/recommenced-user.service';

@Component({
  selector: 'ait-table-inline-edit',
  templateUrl: './table-inline-edit.component.html',
  styleUrls: ['./table-inline-edit.component.scss'],
})
export class TableInlineEditComponent
  extends AitBaseComponent
  implements OnInit {
  @Input() isView = false;
  @Input() isNew = false;
  @Input() project_key: string;
  @Output() saveInline: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeData: EventEmitter<boolean> = new EventEmitter<boolean>();
  employeeList: any[] = [];
  isEdit = false;

  _key = '';
  list_candidate_perpage = [];
  list_perpage_clone = [];
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
  isItemNull = false;
  isDialogOpen = false;
  dateFormat: string;
  planObj = [];
  private monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(
    private addRoleService: AddRoleService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
    private recommencedService: RecommencedUserService,
    private bizProjectService: BizProjectService,
    private element: ElementRef,

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
      planned: new FormControl(null),
      _key: new FormControl(null),
      start_plan: new FormControl(null),
      end_plan: new FormControl(null),
      hour_plan: new FormControl(null),
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

  async ngOnChanges(): Promise<void> {
    if (this.isNew) {
      this.isEdit = true;
      this.list_candidate.unshift('');
      await this.displayList(this.list_candidate, this.rows, this.current_page);
    }
  }

  async handleClickEdit(_key: string) {
    this.saveInline.emit(true);
    this._key = _key;
    this.isEdit = true;
    const biz_project_user = await this.list_candidate_perpage.find(
      (item) => item._key === _key
    );
    this.candidateEdit.patchValue({ ...biz_project_user });
  }

  async handleClickCancel(index: number, item: any) {
    if (item == '') {
      this.list_candidate.splice(index, 1);
      await this.displayList(this.list_candidate, this.rows, this.current_page);
    } else {
      this._key = null;
      this.isEdit = false;
    }
  }

  async handleClickDelete(_key: string) {
    const biz_project_user = await this.list_candidate_perpage.find(
      (item) => item._key === _key
    );
    const user_id = biz_project_user.user_id;
    this.isDialogOpen = true;
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('Do you want remove.'),
        },
      })
      .onClose.subscribe(async (event) => {
        this.isDialogOpen = false;
        if (event) {
          const _from = `biz_project/${this.project_key}`;
          const _to = `sys_user/${user_id}`;
          this.recommencedService
            .removeTeamMember(_from, _to)
            .then(async (r) => {
              if (r.status === RESULT_STATUS.OK) {
                await this.getCandidate();
                await this.displayList(
                  this.list_candidate,
                  this.rows,
                  this.current_page
                );
                this.showToastr('', this.getMsg('I0005'));
              }
            });
        }
      });
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

  handleClickSave(index: number) {
    const lis_data_save = this.bizProjectService.data_save;
    const data_save = {};
    const project_user = this.candidateEdit.value;
    if (
      project_user['end_plan'] &&
      project_user['end_plan'] < project_user['start_plan']
    ) {
      this.isDialogOpen = true;
      this.dialogService
        .open(AitConfirmDialogComponent, {
          context: {
            title: this.translateService.translate(
              'End plan can not less than Start plan.'
            ),
          },
        })
        .onClose.subscribe(async (event) => {
          this.isDialogOpen = false;
          if (event) {
          }
        });
    } else {
      if (project_user.employee_name) {
        Object.keys(this.candidateEdit.controls).forEach((key) => {
          if (key == 'employee_name') {
            data_save[key] = project_user[key].value;
            data_save['user_id'] = project_user[key]._key;
          } else {
            data_save[key] = project_user[key];
          }
        });
        if (!data_save['end_plan'] && data_save['start_plan']) {
          const start_plan = new Date(data_save['start_plan']);
          const end_plan = new Date(
            start_plan.getFullYear(),
            start_plan.getMonth() + 1,
            0
          );
          data_save['end_plan'] = end_plan.setMilliseconds(100);
        }

        data_save['start_plan_format'] = this.getDateFormat(
          data_save['start_plan']
        );
        data_save['end_plan_format'] = this.getDateFormat(
          data_save['end_plan']
        );
        delete data_save['planned'];
        this.list_candidate_clone = this.list_candidate_perpage;
        this.save_data = this.list_candidate;
        this.list_candidate_perpage[index] = data_save;
        this.save_data.splice(
          this.start,
          this.end,
          ...this.list_candidate_perpage
        );
        if (isArrayFull(lis_data_save)) {
          lis_data_save.forEach((item, index) => {
            if (item._key == data_save['_key']) {
              lis_data_save.splice(index, 1, data_save);
            } else {
              lis_data_save.push(data_save);
            }
          });
        } else {
          lis_data_save.push(data_save);
        }
        this.bizProjectService.data_save = lis_data_save;
        this.isEdit = false;
        this._key = '';
        this.saveInline.emit(false);
        this.changeData.emit(true);
      } else {
        this.isDialogOpen = true;
        this.dialogService
          .open(AitConfirmDialogComponent, {
            context: {
              title: this.translateService.translate('Name is required '),
            },
          })
          .onClose.subscribe(async (event) => {
            this.isDialogOpen = false;
          });
      }
    }
  }

  scrollIntoError() {
    const invalidControl = this.element.nativeElement.getElementById(
      'end_plan_input'
    );
    try {
      invalidControl.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      });
    } catch {}
  }

  async getCandidate(): Promise<any[]> {
    this.list_candidate = [];
    const result = await this.bizProjectService.getBizProjectUser(
      this.project_key
    );
    const candidates = result.data;

    for (const item of candidates) {
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
      const planned = await this.setupPlan(data['user_id']);
      if (planned.length === 0 ) {}
      const plan =
        'Plan for the next 3 months:' + (planned.length !== 0 ?
       ( planned.reduce((a, b) => a + b.mm, 0).toFixed(2) +
        'Mm') : (0 + 'Mm') ) ;
      const plane_detail =
        planned[0].value +
        ': ' +
        Math.round(Number(planned[0]['mm']) * 100) / 100 +
        ', ' +
        planned[1].value +
        ': ' +
        Math.round(Number(planned[1]['mm']) * 100) / 100 +
        ', ' +
        planned[2].value +
        ': ' +
        Math.round(Number(planned[2]['mm']) * 100) / 100;
      data['planned'] = plan;
      data['planned_detail'] = plane_detail;

      this.list_candidate.push(data);
      this.totalRows = this.list_candidate.length;
    }

    return this.list_candidate;
  }

  async displayList(data, row_per_page, page) {
    this.listPage = [];
    this.list_candidate_perpage = [];
    this.current_page = Number(page);
    this.start = Number(row_per_page) * (Number(page) - 1);
    this.end = this.start + Number(row_per_page);
    if (this.end > this.list_candidate.length) {
      this.end = this.list_candidate.length;
    }
    const arr = data;
    const paginatedItems = arr.slice(this.start, this.end);

    for (let i = 0; i < paginatedItems.length; i++) {
      const item = paginatedItems[i];
      this.list_candidate_perpage.push(item);
    }
    const totalPage = Math.ceil(this.totalRows / this.rows);
    for (let i = 1; i <= totalPage; i++) {
      this.listPage.push(i);
    }
    this.list_perpage_clone = this.list_candidate_perpage;
    return this.list_candidate;
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
      return dayjs(time).format(this.dateFormat.toUpperCase());
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

  calculaHoursDayMonthPlan(group: string, form_control: string) {
    let remain_form_control1 = '';
    let remain_form_control2 = '';
    let remain_property1: number;
    let remain_property2: number;
    const input = <HTMLInputElement>(
      document.getElementById(`${form_control}_input_number`)
    );
    const input_value = input.value;
    if (form_control === 'hour_plan') {
      remain_form_control1 = 'manday_plan';
      remain_form_control2 = 'manmonth_plan';
      remain_property1 = Math.round((Number(input_value) / 8) * 1000) / 1000;
      remain_property2 = Math.round((Number(input_value) / 160) * 1000) / 1000;
    }
    if (form_control === 'manday_plan') {
      remain_form_control1 = 'hour_plan';
      remain_form_control2 = 'manmonth_plan';
      remain_property1 = Number(input_value) * 8;
      remain_property2 = Math.round((Number(input_value) / 20) * 1000) / 1000;
    }
    if (form_control === 'manmonth_plan') {
      remain_form_control1 = 'hour_plan';
      remain_form_control2 = 'manday_plan';
      remain_property1 = Number(input_value) * 160;
      remain_property2 = Number(input_value) * 20;
    }
    const remain_property_plan1 = <HTMLInputElement>(
      document.getElementById(`${remain_form_control1}_input_number`)
    );
    remain_property_plan1.value = String(remain_property1);
    const remain_property_plan2 = <HTMLInputElement>(
      document.getElementById(`${remain_form_control2}_input_number`)
    );
    remain_property_plan2.value = String(remain_property2);

    this[group].controls[form_control].markAsDirty();
    this[group].controls[remain_form_control1].markAsDirty();
    this[group].controls[remain_form_control2].markAsDirty();
    this[group].controls[form_control].setValue(input_value);
    this[group].controls[remain_form_control1].setValue(remain_property1);
    this[group].controls[remain_form_control2].setValue(remain_property2);
  }

  onUserChange(value: any, index: number, control: string) {
    if (this.list_candidate_perpage[index] == '') {
      this.list_candidate_perpage[index] = {};
    }
    this.list_candidate_perpage[index][control] = value;
  }

  sumMM() {
    if (this.planObj.length === 0) {
      return 0;
    } else {
      return +this.planObj.reduce((a, b) => a + b.mm, 0).toFixed(2);
    }
  }

  async setupPlan(user_id: string): Promise<any[]> {
    let planObj = [];
    const thisMonth = new Date().getMonth() + 1;
    [...Array(3)].forEach((e, i) => {
      planObj.push({
        _key: thisMonth + i + 1,
        value:
          thisMonth + i > 11
            ? this.monthShortNames[thisMonth - 12 + i]
            : this.monthShortNames[thisMonth + i],
        mm: 0,
      });
    });
    const res = await this.recommencedService.findPlan(user_id);
    if (res.status === RESULT_STATUS.OK) {
      const data = res.data;
      if (data.length === 3) {
        planObj = data;
        this.planObj = data;
      } else {
        this.planObj = planObj;
      }
    } else {
      this.planObj = planObj;
    }
    return planObj;
  }
}
