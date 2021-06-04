/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Component, DoCheck, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { KEYS, RESULT_STATUS } from '@ait/shared';
import {
  NbDialogService,
  NbGlobalLogicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import {
  AppState,
  AitAppUtils,
} from '@ait/ui';
import { AitConfirmDialogComponent } from 'libs/ui/src/lib/components/ait-confirm-dialog/ait-confirm-dialog.component';
import { AitExampleGraphqlService } from './ait-example-graphql.service';

@Component({
  selector: 'ait-example-graphql',
  templateUrl: './ait-example-graphql.component.html',
  styleUrls: ['./ait-example-graphql.component.scss'],
})
export class AitGraphqlComponent implements OnInit, DoCheck {
  totalRows: number;
  source: LocalDataSource = new LocalDataSource();
  allMasterData: MasterData[] = [];
  classCode = [];

  settings = {
    mode: 'inline',
    columns: {
      class: {
        title: 'CLASS',
        type: 'text',
      },
      parent_code: {
        title: 'PARENT',
        type: 'text',
      },
      code: {
        title: 'CODE',
        type: 'text',
      },
      name: {
        title: 'NAME',
        type: 'text',
      },
      create_at: {
        title: 'CREATE AT',
        type: 'html',
        valuePrepareFunction: (cell: unknown, row: MasterData) => {
          return this.valueAsDate(row, KEYS.CREATE_AT);
        },
        editable: false,
        addable: false,
      },
      create_by: {
        title: 'CREATE BY',
        type: 'text',
        editable: false,
        addable: false,
      },
      change_at: {
        title: 'CHANGE AT',
        type: 'html',
        valuePrepareFunction: (cell: unknown, row: MasterData) => {
          return this.valueAsDate(row, KEYS.CHANGE_AT);
        },
        editable: false,
        addable: false,
      },
      change_by: {
        title: 'CHANGE BY',
        type: 'text',
        editable: false,
        addable: false,
      },
    },
    add: {
      confirmCreate: true,
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };

  returnFields = {
    _key: true,
    code: true,
    class: true,
    parent_code: true,
    sort_no: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
    name: true,
    active_flag: true,
  };

  constructor(
    private dialogService: NbDialogService,
    public store: Store<AppState>,
    private service: AitExampleGraphqlService,
    private toastrService: NbToastrService
  ) {}

  async ngOnInit() {
    this.setupData();
  }

  async setupData() {
    this.service.find().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const cloneData = AitAppUtils.deepCloneArray(res.data);
        cloneData.map((e) => {
          e.create_at = new Date(e.create_at).toLocaleString().split(',')[0];
          e.change_at = new Date(e.change_at).toLocaleString().split(',')[0];
        });
        this.source.load(cloneData);
      } else {
        console.error('Something wrong!!!');
      }
    });
  }

  ngDoCheck() {
    this.totalRows = this.source != null ? this.source.count() : null;
  }

  onDelete(event: any): void {
    this.dialogService
      .open(AitConfirmDialogComponent)
      .onClose.subscribe((checked) => {
        if (checked) {
          this.service.remove([{ _key: event.data._key }]).then(
            () => {
              this.showToastr('', 'Successfully deleted information.');
              event.confirm.resolve(event.source.data);
            },
            () =>
              this.showToastr(
                '',
                'An error has occurred from the system',
                KEYS.WARNING
              )
          );
        }
      });
  }

  onEdit(event: any): void {
    const clone = { ...event.newData };
    const skipArray = ['create_at', 'create_by', 'change_at', 'change_by'];
    for (const prop in clone) {
      if (!clone[prop] || skipArray.includes(prop)) {
        delete clone[prop];
      }
    }
    // clone['name'] = this.getObjectName(clone.name);
    this.service.save([clone]).then(
      (data) => {
        data[0].create_at = event.data.create_at;
        data[0].create_by = event.data.create_by;
        data[0].change_at = new Date(data[0].change_at)
          .toLocaleString()
          .split(',')[0];
        this.showToastr('', 'Successfully updated information.');
        event.confirm.resolve(data[0]);
      },
      () =>
        this.showToastr(
          '',
          'An error has occurred from the system',
          KEYS.WARNING
        )
    );
  }

  onCreate(event: any) {
    const clone = { ...event.newData };
    for (const prop in clone) {
      if (!clone[prop]) {
        delete clone[prop];
      }
    }
    clone['sort_no'] = 1;
    clone['active_flag'] = true;
    // clone['name'] = this.getObjectName(clone.name);

    this.service.save([clone]).then(
      (data) => {
        this.showToastr('', 'Registration information is successful.');
        event.confirm.resolve(data[0]);
      },
      () =>
        this.showToastr(
          '',
          'An error has occurred from the system',
          KEYS.WARNING
        )
    );
  }

  getObjectName(name: string) {
    return Object.assign(
      {},
      {
        ja_JP: name,
        vi_VN: name,
        en_US: name,
      }
    );
  }

  valueAsDate(data: MasterData, type: string) {
    if (type === KEYS.CREATE_AT) {
      return new Date(data.create_at).toLocaleString().split(',')[0];
    } else if (type === KEYS.CHANGE_AT) {
      return new Date(data.change_at).toLocaleString().split(',')[0];
    }
  }

  showToastr(
    title: string = '',
    message: string = '',
    status:
      | 'info'
      | 'warning'
      | 'primary'
      | 'danger'
      | 'basic'
      | 'success' = KEYS.SUCCESS
  ) {
    this.toastrService.show(title, message, {
      status,
      position: NbGlobalLogicalPosition.BOTTOM_END,
      preventDuplicates: true,
    });
  }
}

export interface MasterData {
  company: string;
  active_flag: boolean;
  class: string;
  parent_code: string;
  code: string;
  // name: {
  //   ja_JP: string;
  //   en_US: string;
  //   vi_VN: string;
  // };
  name: string;
  sort_no: number;

  create_by: string;
  create_at: number;
  change_by: string;
  change_at: number;
}
