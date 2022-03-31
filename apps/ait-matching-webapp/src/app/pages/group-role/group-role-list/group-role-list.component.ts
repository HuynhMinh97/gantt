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
  AitSaveTempService,
  AitTableButtonComponent,
  AitTranslationService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { GroupDataListService } from '../../../services/group-data-list.service';
import { GroupRoleRegisterService } from '../../../services/group-role-register.service';

@Component({
  selector: 'ait-group-data-list',
  templateUrl: './group-role-list.component.html',
  styleUrls: ['./group-role-list.component.scss'],
})
export class GroupRoleListComponent extends AitBaseComponent implements OnInit {
  @ViewChild('Container', { static: false }) Container: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('area') area: ElementRef;
  toggleTable = new EventEmitter();
  toggle = new EventEmitter();
  source: LocalDataSource;
  settingTable: any;
  nameFileCsv = '';
  settings = {
    actions: false,
    selectMode: 'multi',
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      _key: {
        title: '',
        filter: false,
        type: 'custom',
        renderComponent: AitTableButtonComponent,
        onComponentInitFunction: (instance: any) => {
          instance?.detailEvent.subscribe((data: string) => this.detail(data));
          instance?.copyEvent.subscribe((data: string) => this.copy(data));
          instance?.editEvent.subscribe((data: string) => this.edit(data));
          instance?.deleteEvent.subscribe((data: string) => this.delete(data));
        },
      },
      name: {
        title: 'Name',
        filter: true,
      },
      employee_name: {
        title: 'Employee Name',
        filter: true,
      },
      permission: {
        title: 'Permission',
        filter: true,
      },
      create_by: {
        title: 'Create By',
        filter: true,
      },
      create_at: {
        title: 'Create At',
        filter: true,
      },
      change_by: {
        title: 'Change By',
        filter: true,
      },
      change_at: {
        title: 'Change At',
        filter: true,
      },
    },
  };
  groupDataTable: any;
  columns = [];
  searchRole: FormGroup;
  dataSettingTable: any[] = [];
  selectedItems: any[] = [];
  dataExport: any[] = [];
  displayColumn = [];
  totalRows: number;
  dataTable: any[] = [];
  settingDataTable: any;
  dateFormat: string;
  type: boolean;
  isTableExpan = true;
  isSetting = false;
  isSubmit = false;
  isExpan = false;
  isReset = false;
  done = false;
  isValidPage = true;
  isChangeAtError = false;
  isCreateAtError = false;
  pageDetail = '';
  perPage = '10';
  left = 0;
  errorListDelete = [];
  changeAtErrorMessage = [];
  createAtErrorMessage = [];
  listDbConnectionInDimension = [];
  columnExport = [
    'name',
    'create_by',
    'create_at',
    'change_by',
    'change_at',
    'data_source_type',
  ];
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  userAttribute = ['create_by', 'change_by'];
  comboboxSearch = ['permission',];

  set = {};
  countPage = 0;
  constructor(
    public router: Router,
    private translateService: AitTranslationService,
    private formBuilder: FormBuilder,
    private groupDataListService: GroupDataListService,
    private groupRoleRegisterService: GroupRoleRegisterService,

    store: Store<AppState>,
    apollo: Apollo,
    env: AitEnvironmentService,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
    saveTempService: AitSaveTempService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService,
      saveTempService
    );

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.searchRole = this.formBuilder.group({
      name: new FormControl(null),
      employee_name: new FormControl(null),
      permission: new FormControl(null),
      create_by: new FormControl(null),
      change_by: new FormControl(null),
      change_at_to: new FormControl(null),
      create_at_to: new FormControl(null),
      change_at_from: new FormControl(null),
      create_at_from: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    this.cancelLoadingApp();
    await this.getDataTable();
    this.done = true;
    this.settingTable = this.settings;
    for (const item in this.settingTable.columns) {
      if (item != '_key') {
        this.columns.push({
          _key: item,
          value: this.settingTable.columns[item]['title'],
        });
      }
    }
    this.dataSettingTable = JSON.parse(JSON.stringify(this.columns));
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

  async getDataTable(obj?: any) {
    this.groupRoleRegisterService.role_key = undefined;
    this.groupDataTable = [];
    await this.groupDataListService.getGroupDataList(obj).then((res) => {
      const listRole = res.data;
      listRole.forEach((role) => {
        const roleTable = {};
        roleTable['name'] = role?.name;
        roleTable['_key'] = role?._key + '/' + role?.userId;
        roleTable['employee_name'] = role?.employee_name;
        roleTable['permission'] = role?.permission;
        roleTable['create_at'] = this.getDateFormat(role?.create_at);
        roleTable['create_by'] = role?.create_by;
        roleTable['change_by'] = role?.change_by;
        roleTable['change_at'] = this.getDateFormat(role?.change_at);
        if (roleTable['name']!==undefined) {
          this.groupDataTable.push(roleTable);
        }
      });
    });
    this.cancelLoadingApp();
    this.source = new LocalDataSource(this.groupDataTable);
  }

  async search() {
    const obj = this.searchRole.value;
    if (this.searchRole.valid) {
      const object = {};
      Object.keys(this.searchRole.controls).forEach((key) => {
        const value = this.searchRole.controls[key].value;
        if (value) {
          if (this.dateAtributes.includes(key)) {
              object[key] = {
                target: key.slice(0, 9) || '',
                operator: this.getOperator(key),
                valueAsNumber: value,
              };
          } else {
            if (this.userAttribute.includes(key)) {
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
                object[key]['value'] = this.getArrayKeys(value);
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
        }
      });
      if (isObjectFull(object)) {
        await this.getDataTable(object);
        this.focusToTable();
      } else {
        await this.getDataTable();
        this.focusToTable();
      }
    } else {
      await this.getDataTable();
      this.focusToTable();
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

  new() {
    this.groupRoleRegisterService.groupSaveRole = [];
    this.router.navigate([`group-role-register`]);
  }

  delete(data) {
    console.log('1');
    // let checkUse = null;
    // if (this.listDbConnectionInDimension.length > 0) {
    //   checkUse = this.listDbConnectionInDimension.find(actor => actor === data);
    // }
    // if (!checkUse) {
    //   this.dialogService.open(AitConfirmDialogComponent, {
    //     closeOnBackdropClick: true,
    //     hasBackdrop: true,
    //     autoFocus: false,
    //     context: {
    //       title: this.getMsg('I0004'),
    //     },
    //   })
    //     .onClose.subscribe(async (event) => {
    //       if (event) {
    //         await this.dbConnectionService.removeDbConnectionByKey(data)
    //           .then((res) => {
    //             if (res.status === RESULT_STATUS.OK) {
    //               this.showToastr('', this.getMsg('I0003'));
    //               this.getAllData();
    //             } else {
    //               this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
    //             }

    //           })
    //       }
    //     });
    // } else {
    //   this.showToastr('', this.getMsg('E0051'), KEYS.WARNING);
    // }
  }

  edit(data) {
    this.groupRoleRegisterService.role_key = data;
    this.groupRoleRegisterService.roleDataSave = [];
    this.groupRoleRegisterService.groupRoleList = [];
    this.router.navigate([`group-role-register`]);
  }

  copy(data) {
    // this.dbConnectionService.copyKey = data;
    this.router.navigate([`db-connection-register`]);
  }

  detail(data) {
    this.router.navigate([`db-connection-view/${data}`]);
  }

  onUserRowSelect(event: any) {
    if (event.data === null) {
      this.selectedItems = event.selected.length
        ? this.selectedItems.concat(event.selected)
        : [];
    } else {
      if (event.isSelected) {
        this.selectedItems = this.selectedItems.concat(event.selected);
      } else {
        const index = this.selectedItems.indexOf(event.data);
        if (index !== -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    }
    const UtilArray = [];
    this.selectedItems = this.selectedItems.concat(event.selected);
    this.selectedItems.forEach((item) => {
      if (UtilArray.findIndex((i) => i._key == item._key) === -1) {
        UtilArray.push(item);
      }
    });
    this.selectedItems = UtilArray;
  }

  settingColumns(data) {
    this.dataSettingTable = data;
    const columns = [];
    this.settingTable = {
      actions: false,
      selectMode: 'multi',
      noDataMessage: '',
      columns: {
        _key: {
          title: '',
          filter: false,
          type: 'custom',
          renderComponent: AitTableButtonComponent,
          onComponentInitFunction: (instance: any) => {
            instance?.detailEvent.subscribe((data: string) =>
              this.detail(data)
            );
            instance?.copyEvent.subscribe((data: string) => this.copy(data));
            instance?.editEvent.subscribe((data: string) => this.edit(data));
            instance?.deleteEvent.subscribe((data: string) =>
              this.delete(data)
            );
          },
        },
      },
    };

    for (const column of data) {
      this.settingTable.columns[column._key] = {
        title: column.value,
        filter: true,
      };
      columns.push(column._key);
    }
    this.columnExport = columns;
    this.done = true;
    if (data.length == 0) {
      this.done = false;
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.searchRole.controls[form].markAsDirty();
      this.searchRole.controls[form].setValue(value);
    } else {
      this.searchRole.controls[form].setValue(null);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.searchRole.controls[form].markAsDirty();
      this.searchRole.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.searchRole.controls[form].setValue(null);
    }
  }

  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (value !== []) {
      if (isObjectFull(value)) {
        this.searchRole.controls[form].markAsDirty();
        this.searchRole.controls[form].setValue(value);
      } else {
        this.searchRole.controls[form].setValue(null);
      }
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      if (form == 'create_at_to' || form == 'change_at_to') {
        value = new Date(data).setHours(23, 59, 59, 0);
      } else {
        value = new Date(data).setHours(0, 0, 0, 0);
      }
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    } else {
      this[group].controls[form].setValue(null);
    }
    this.checkDateError(form);
  }

  checkDateError(form: string) {
    const type = form.substring(0, 9);
    const name = type === 'create_at' ? 'isCreateAtError' : 'isChangeAtError';
    const valueFrom = this.searchRole.controls[type + '_from'].value;
    const valueTo = this.searchRole.controls[type + '_to'].value;

    if (!valueFrom || !valueTo) {
      this[name] = false;
    } else if (valueFrom > valueTo) {
      this[name] = true;
    } else {
      this[name] = false;
    }
    this.getError();
  }

  getError() {
    const msg = this.getMsg('E0004');
    const createAtError = (msg || '')
      .replace(
        '{0}',
        this.translateService.translate('create_at_to')
      )
      .replace(
        '{1}',
        this.translateService.translate('create_at_from')
      );
    const changeAtError = (msg || '')
      .replace(
        '{0}',
        this.translateService.translate('change_at_to')
      )
      .replace(
        '{1}',
        this.translateService.translate('change_at_from')
      );

    this.changeAtErrorMessage = [];
    this.createAtErrorMessage = [];
    this.changeAtErrorMessage.push(changeAtError);
    this.createAtErrorMessage.push(createAtError);
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }


  clear(){
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.searchRole.reset();
    
  }
}
