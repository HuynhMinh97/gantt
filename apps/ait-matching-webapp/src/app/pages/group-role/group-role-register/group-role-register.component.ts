import { Router } from '@angular/router';

import { GroupRoleRegisterService } from './../../../services/group-role-register.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
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
import { isArrayFull, isObjectFull } from '@ait/shared';

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

  roleRegis: FormGroup;
  settingTable: any;
  selectedItems: any[] = [];
  roleRegisterDataTable: any[] = [];

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
      employee: {
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
      this.router.navigate([`add-role`]);
    } else {
    }
  }

  settingDataTable() {
    const data = this.groupRoleRegisterService.roleDataSave;
    const source =  this.groupRoleRegisterService.groupRoleList
    
    this.roleRegisterDataTable = [];
    if (isObjectFull(source))
    {
      if (isObjectFull(data)) {
        const roleTable = {};
        roleTable['name'] = data?.name;
        roleTable['module'] = data?.module?.value;
        roleTable['_key'] = data?.names;
        roleTable['page'] = data?.page?.value;
        roleTable['employee'] = data?.employee?.value;
        roleTable['permission'] = data?.permission?.value;
        source.data.push(roleTable);
      }
      this.roleRegisterDataTable = source.data
    }
    
    if ( !isObjectFull(this.roleRegisterDataTable[0]))
    {
      this.roleRegisterDataTable.shift();
    }
    this.cancelLoadingApp();
    this.source = new LocalDataSource(this.roleRegisterDataTable);
  
  }

  // async deleteAllInTable(data) {
  //   if (this.selectedItems.length > 0 && data) {
  //     const attributes = this.actorRegisterService.actorData['attribute'];
  //     for(const itemDelete of this.selectedItems){
  //       let search = -1;
  //       if(attributes.length > 0){
  //         attributes.forEach((attribute, index) => {
  //           if(attribute.names == itemDelete?._key){
  //             search = index;
  //           }
  //         })
  //       }
  //       if(search >=0){
  //         this.actorRegisterService.actorData['attribute'].splice(search, 1);
  //       }
  //     }
  //     this.isChangedTable = ! await this.checkAllowAttributeList();
  //     this.settingDataTable();
  //   }
  // }
}
