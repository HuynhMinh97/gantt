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
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';

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

  employeeId = '';
  groupName = '';
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
  }
  async ngOnInit(): Promise<void> {
    this.employeeId = this.groupRoleRegisterService.name;
    if (this.employeeId !== undefined) 
    {
      this.mode = MODE.EDIT;
    }
    else {
      this.mode = MODE.NEW;
    }
    setTimeout(() => {
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
      this.cancelLoadingApp();
      this.settingDataTable();
    }, 700);
    const listSaveRole = this.groupRoleRegisterService.groupSaveRole;
    if (isObjectFull(listSaveRole)){
      this.saveRoleData = listSaveRole;
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
    console.log('1');
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
      if (column._key == 'dimension') {
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
      if (isObjectFull(this.saveRoleData))
      {
        this.groupRoleRegisterService.groupSaveRole = this.saveRoleData;
      }
      
      this.router.navigate([`add-role`]);
    } else {
    }
  }

  async getRoleList() {
    const arr = [];
    const roleList = await this.groupRoleRegisterService.getGroupRoleList(
      this.employeeId
    );
    for (const role of roleList.data) {
      console.log(role);
      const dataTable = {};
      dataTable['name'] = role?.name;
      dataTable['module'] = role?.module;
      dataTable['create_at'] = role?.create_at;
      dataTable['create_by'] = role?.create_by;
      dataTable['change_by'] = role?.change_by;
      dataTable['change_at'] = role?.change_at;
      dataTable['page'] = role?.page;
      dataTable['employee_name'] = role?.employee_name;
      dataTable['permission'] = role?.permission;
      arr.push(dataTable);
    }
    return arr;
  }

  async settingDataTable() {
    const data = this.groupRoleRegisterService.roleDataSave;
    const permissions = [];
    const employee = [];
    const source = this.groupRoleRegisterService.groupRoleList;
    this.roleRegisterDataTable = [];
    if (isObjectFull(source)) {
      if (isObjectFull(data)) {
        
        Object.keys(data.permission).forEach((key) => {
          const value = data.permission[key]._key;
          permissions.push(value);
        });
        Object.keys(data.employee_name).forEach((key) => {
          const value = data.employee_name[key].value;
          employee.push(value);
        });
        employee.forEach((emp) => {
          const roleTable = {};
          roleTable['groupName'] = data?.groupName;
          roleTable['name'] = data?.name;
          roleTable['module'] = data?.module?.value;
          roleTable['module_key'] = data?.module?._key;
          roleTable['page_key'] = data?.page?._key;
          roleTable['page'] = data?.page?.value;
          roleTable['employee_name'] = emp;
          roleTable['permission'] = permissions.join(', ');
          this.saveRoleData.push(roleTable);
          this.roleRegisterDataTable.push(roleTable);
        })
        
      }
      source.data.forEach((data) => {
        this.roleRegisterDataTable.push(data);
      })
      
    } else {
      if (this.mode === MODE.EDIT) {
        this.roleRegisterDataTable = await this.getRoleList();
      } else {
       
        Object.keys(data.permission).forEach((key) => {
          const value = data.permission[key]._key;
          permissions.push(value);
        });
        Object.keys(data.employee_name).forEach((key) => {
          const value = data.employee_name[key].value;
          employee.push(value);
        });
        employee.forEach((emp) => {
          const roleTable = {};
          roleTable['name'] = data?.name;
          roleTable['groupName'] = data?.groupName;
          roleTable['module'] = data?.module?.value;
          roleTable['module_key'] = data?.module?._key;
          roleTable['page_key'] = data?.page?._key;
          roleTable['page'] = data?.page?.value;
          roleTable['employee_name'] = emp;
          roleTable['permission'] = permissions.join(', ');
          this.saveRoleData.push(roleTable);
          this.roleRegisterDataTable.push(roleTable);
        })
      }
    }
    this.cancelLoadingApp();
    this.source = new LocalDataSource(this.roleRegisterDataTable);
  }

  async saveGroupRole() {
    let groupRoleKey = '';
    for (const role of this.saveRoleData){
      const groupRole = {
        name: role.groupName,
      }
      const resModule = await this.renderPageService.findModule({
        code: role.module_key,
      });
      const resPage = await this.renderPageService.findPage({
        code: role.page_key,
      });
      await this.groupRoleRegisterService.saveRoleName(groupRole).then(async (res) => {
        if (res?.status === RESULT_STATUS.OK) {
          groupRoleKey = res?.data[0]._key;
          await this.saveRolePage(groupRoleKey,resModule.data[0]._key,resPage.data[0]._key)
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

  async saveRolePage(role_key: string, module_key: string, page_key: string) {
    const sys_role_page = {
      _from: 'sys_role/' + role_key,
      _to: 'sys_page/' + page_key,
      module: module_key
    }
    await this.groupRoleRegisterService.saveRolePage(sys_role_page);
    
    // if ( this.keyEdit) {
    //   const _fromSkill = [
    //     { _from: 'biz_project/' + this.project_key },
    //   ];
    //   this.userProjectService.removeSkill(_fromSkill);
    // }
    // for(const skill of this.listSkills){
    //   await this.userProjectService.findMSkillsByCode(skill)
    //     .then(async (res) => {
    //       this.sort_no += 1;
    //       this.biz_project_skill.sort_no = this.sort_no;
    //       this.biz_project_skill._to = 'm_skill/' + res.data[0]._key;
    //       await this.userProjectService.saveSkills(this.biz_project_skill);
    //     });
    // }
  }
  
}
