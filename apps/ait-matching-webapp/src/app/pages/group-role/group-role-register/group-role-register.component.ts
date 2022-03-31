import { Router } from '@angular/router';

import { GroupRoleRegisterService } from './../../../services/group-role-register.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitRenderPageService,
  AitTableButtonComponent,
  AitTableCellComponent,
  AppState,
  getUserSetting,
  MODE,
} from '@ait/ui';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';
import { AddRoleService } from '../../../services/add-role.service';

@Component({
  selector: 'ait-group-role-register',
  templateUrl: './group-role-register.component.html',
  styleUrls: ['./group-role-register.component.scss'],
})
export class GroupRoleRegisterComponent
  extends AitBaseComponent
  implements OnInit {
  toggleTable = new EventEmitter();
  @ViewChild('area') area: ElementRef;
  @ViewChild('display', { static: false }) display: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  totalRows: number;
  source: LocalDataSource;

  mode = MODE.NEW;
  pageDetail = '';
  done = false;
  dateFormat: string;
  roleAndEmployeeKey='';
  role_key = '';
  employee_key = '';
  groupName = '';
  remark = '';
  isExpan = false;
  isExist = false;
  isReset = false;
  isSubmit = false;
  isValidPage = true;
  isTableExpan = true;
  isChangedForm = false;
  isToggleTable = false;
  isChangedTable = false;
  dataSettingTable: any[] = [];
  columns = [];
  columnExport = [
    'name',
    'module',
    'page',
    'employee',
    'permission',
    'create_by',
    'create_at',
    'change_by',
    'change_at',
  ];

  sys_role_page = {
    _from: '',
    _to: '',
    module: '',
  };

  roleRegis: FormGroup;
  settingTable: any;
  selectedItems: any[] = [];
  roleRegisterDataTable: any[] = [];
  saveRoleData = [];

  settings = {
    actions: false,
    selectMode: 'multi',
    noDataMessage: '',
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
          instance?.copyEvent.subscribe((data: string) => this.coppy(data));
          instance?.editEvent.subscribe((data: string) => this.edit(data));
          instance?.deleteEvent.subscribe((data: string) =>
            this.deleteInTable(data, true)
          );
        },
      },
      name: {
        title: 'Name',
        filter: true,
      },
      module: {
        title: 'Module',
        filter: true,
      },
      page: {
        title: 'Page',
        filter: true,
      },
      employee_name: {
        title: 'Employee',
        filter: true,
      },
      permission: {
        title: 'Permission',
        filter: true,
      },
      create_by: {
        title: 'CreateBy',
        filter: true,
      },
      create_at: {
        title: 'CreateAt',
        filter: true,
      },
      change_by: {
        title: 'ChangeBy',
        filter: true,
      },
      change_at: {
        title: 'ChangeAt',
        filter: true,
      },
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private renderPageService: AitRenderPageService,
    private groupRoleRegisterService: GroupRoleRegisterService,
    private addRoleService:AddRoleService,
    public router: Router,

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

    this.roleRegis = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      remark: new FormControl(null),
    });

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }
  async ngOnInit(): Promise<void> {
    this.cancelLoadingApp();
    this.roleAndEmployeeKey = this.groupRoleRegisterService?.role_key;
    this.employee_key = this.roleAndEmployeeKey?.substring(this.roleAndEmployeeKey?.indexOf('/') + 1)
    this.role_key = this.roleAndEmployeeKey?.substring(0,this.roleAndEmployeeKey?.indexOf('/'))
    if (this.roleAndEmployeeKey !== undefined) {
      this.mode = MODE.EDIT;
    } else {
      this.mode = MODE.NEW;
    }
    await this.settingDataTable();
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
    console.log(this.settingTable);
    const listSaveRole = this.groupRoleRegisterService.groupSaveRole;
    if (isObjectFull(listSaveRole)) {
      this.saveRoleData = listSaveRole;
      this.isChangedTable = true;
    }
  }

  toggleTableExpan = () => {
    setTimeout(() => {
      if (this.isToggleTable) {
        this.isTableExpan = !this.isTableExpan;
        this.toggleTable.emit(this.isTableExpan);
      }
    }, 100);
  };

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.roleRegis.controls[form].markAsDirty();
      this.roleRegis.controls[form].setValue(value);
    } else {
      this.roleRegis.controls[form].setValue(null);
    }
  }

  detail(data?: any) {
    console.log('1');
  }
  coppy(data?: any) {
    console.log('1');
  }
  edit(data?: any) {
    this.groupRoleRegisterService.groupRole = this.roleRegis.value;
    this.addRoleService.roleUser_key = data;
    this.router.navigate([`add-role`]);
  }
  async deleteInTable(data?: any, load?: boolean) {
    console.log('1');
  }

  getColumns(data) {
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
            instance?.copyEvent.subscribe((data: string) => this.coppy(data));
            instance?.editEvent.subscribe((data: string) => this.edit(data));
            instance?.deleteEvent.subscribe((data: string) =>
              this.deleteInTable(data, true)
            );
          },
        },
      },
    };

    for (const column of data) {
      if (column._key == 'role_name') {
        const dimension = {
          title: 'Dimension',
          filter: true,
          type: 'custom',
          renderComponent: AitTableCellComponent,
          valuePrepareFunction: (value: string) => {
            const obj = {
              text: value,
              type: 'array',
              style: {
                width: 200,
              },
            };
            return obj;
          },
        };
        this.settingTable.columns[column._key] = dimension;
        columns.push(column._key);
      } else {
        this.settingTable.columns[column._key] = {
          title: column.value,
          filter: true,
        };
        columns.push(column._key);
      }
    }
    this.columnExport = columns;
    this.done = true;
    if (data.length == 0) {
      this.done = false;
    }
  }

  add() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.roleRegis.valid) {
      this.groupRoleRegisterService.groupRole = this.roleRegis.value;
      this.groupRoleRegisterService.groupRoleList = this.source;
      if (isObjectFull(this.saveRoleData)) {
        this.groupRoleRegisterService.groupSaveRole = this.saveRoleData;
      }

      this.router.navigate([`add-role`]);
    } else {
    }
  }

  async getRoleList() {
    const arr = [];
    const roleList = await this.groupRoleRegisterService.getGroupRoleList(
      this.role_key, this.employee_key
    );
    this.groupName = roleList?.data[0]?.name;
    this.remark = roleList?.data[0]?.remark;
    for (const role of roleList.data) {
      
      const dataTable = {};
      dataTable['name'] = role?.child_name;
      dataTable['_key'] = role?.roleUser_key;
      dataTable['module'] = role?.module;
      dataTable['create_at'] = this.getDateFormat(role?.create_at);
      dataTable['create_by'] = role?.create_by;
      dataTable['change_by'] = role?.change_by;
      dataTable['change_at'] = this.getDateFormat(role?.change_at);
      dataTable['page'] = role?.page;
      dataTable['employee_name'] = role?.employee_name;
      dataTable['permission'] = role?.permission;
      arr.push(dataTable);
    }
    console.log(arr);
    return arr;
  }

  async settingDataTable() {
    const data = this.groupRoleRegisterService.roleDataSave;
    if (this.groupName === '') {
      this.groupName = data?.groupName;
      this.remark = data?.remarkGroup;
    }
    const permissions = [];
    const source = this.groupRoleRegisterService.groupRoleList;
    this.roleRegisterDataTable = [];
    if (isObjectFull(source)) {
      if (isObjectFull(data)) {
        Object.keys(data.permission).forEach((key) => {
          const value = data.permission[key]._key;
          permissions.push(value);
        });
        data.employee_name.forEach((emp) => {
          const roleTable = {};
          roleTable['groupName'] = data?.groupName;
          roleTable['name'] = data?.name;
          roleTable['remark'] = data?.remark;
          roleTable['module'] = data?.module?.value;
          roleTable['module_key'] = data?.module?._key;
          roleTable['page_key'] = data?.page?._key;
          roleTable['page'] = data?.page?.value;
          roleTable['employee_name'] = emp.value;
          roleTable['employee__key'] = emp._key;
          roleTable['permission'] = permissions.join(', ');
          this.saveRoleData.push(roleTable);
          this.roleRegisterDataTable.push(roleTable);
        });
        this.isChangedTable = true;
      }
      source.data.forEach((data) => {
        this.roleRegisterDataTable.push(data);
      });
    } else {
      if (this.mode === MODE.EDIT) {
        this.roleRegisterDataTable = await this.getRoleList();
      } else {
        if (isObjectFull(data)) {
          Object.keys(data.permission).forEach((key) => {
            const value = data.permission[key]._key;
            permissions.push(value);
          });
          data.employee_name.forEach((emp) => {
            const roleTable = {};
            roleTable['name'] = data?.name;
            roleTable['groupName'] = data?.groupName;
            roleTable['module'] = data?.module?.value;
            roleTable['module_key'] = data?.module?._key;
            roleTable['page_key'] = data?.page?._key;
            roleTable['page'] = data?.page?.value;
            roleTable['remark'] = data?.remark;
            roleTable['employee_name'] = emp.value;
            roleTable['employee__key'] = emp._key;
            roleTable['permission'] = permissions.join(', ');
            this.saveRoleData.push(roleTable);
            this.roleRegisterDataTable.push(roleTable);
          });
          this.isChangedTable = true;
        }
      }
    }
    this.cancelLoadingApp();
    setTimeout(() => {
      this.source = new LocalDataSource(this.roleRegisterDataTable);
    }, 700);
  }

  async saveGroupRole() {
    
    const groupRoleInfo = this.roleRegis.value;
    const groupRole = {
      name: groupRoleInfo.name,
      remark: groupRoleInfo.remark,
    };
    let groupRoleKey = '';
    for (const role of this.saveRoleData) {
      const resModule = await this.renderPageService.findModule({
        code: role.module_key,
      });
      const resPage = await this.renderPageService.findPage({
        code: role.page_key,
      });
      const existRole = await this.groupRoleRegisterService.findRole(
        role.groupName
      );
      if (!isObjectFull(existRole.data[0])) {
        await this.groupRoleRegisterService
          .saveRoleName(groupRole)
          .then(async (res) => {
            if (res?.status === RESULT_STATUS.OK) {
              groupRoleKey = res?.data[0]._key;
              await this.saveRoleUser(
                groupRoleKey,
                role.permission,
                role.employee__key,
                role.name,
                role.remark,
                resModule.data[0]._key,
                resPage.data[0]._key
              ).then((res) => {
                if (res?.status === RESULT_STATUS.OK) {
                  const message =
                    this.mode === 'NEW'
                      ? this.getMsg('I0001')
                      : this.getMsg('I0002');
                  this.showToastr('', message);
                  this.cancelLoadingApp();
                } else {
                  this.cancelLoadingApp();
                  this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
                }
              });
            } else {
              this.cancelLoadingApp();
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          });
      } else {
        groupRoleKey = existRole.data[0]._key;
        await this.saveRoleUser(
          groupRoleKey,
          role.permission,
          role.employee__key,
          role.name,
          role.remark,
          resModule.data[0]._key,
          resPage.data[0]._key
        ).then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.cancelLoadingApp();
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        });
      }
    }
    this.groupRoleRegisterService.roleDataSave = [];
    this.router.navigate([`group-role-list`]);
  }

  async saveRoleUser(
    role_key: string,
    permission: string,
    user_key: string,
    name: string,
    remark: string,
    module_key: string,
    page_key: string
  ) {
    const permissionArr = permission.split(', ');
    const sys_role_page = {
      _from: 'sys_role/' + role_key,
      _to: 'sys_user/' + user_key,
      permission: permissionArr,
      name: name,
      remark: remark,
      module: module_key,
      page: page_key,
    };
    return await this.groupRoleRegisterService.saveRoleUser(sys_role_page);
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }
}
