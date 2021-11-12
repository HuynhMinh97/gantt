/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  isArrayFull,
  isObjectFull,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import {
  AitAuthService,
  AitEnvironmentService,
  AitMasterDataService,
  AitRenderPageService,
  AitSaveTempService,
  AitTranslationService,
  AitUserService,
} from '../../services';
import { AppState } from '../../state/selectors';
import { AitTableCellComponent } from '../ait-table-cell/ait-table-cell.component';
import { AitBaseComponent } from '../base.component';

@Component({
  selector: 'ait-group-search',
  templateUrl: './ait-group-search.component.html',
  styleUrls: ['./ait-group-search.component.scss'],
})
export class AitGroupSearchComponent
  extends AitBaseComponent
  implements OnInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('area') area: ElementRef;
  source: LocalDataSource;
  @Input() page: string;
  @Input() module: string;
  @Input() isExpan = false;
  @Input() isTableExpan = true;
  @Output() toggle = new EventEmitter();
  @Output() toggleTable = new EventEmitter();
  searchForm: FormGroup;
  totalRows: number;
  left = 0;
  moduleKey = '';
  pageKey = '';
  groupKey = '';
  searchComponents: any[] = [];
  tableComponents: any[] = [];
  leftSide: any[] = [];
  rightSide: any[] = [];
  selectedItems: any[] = [];
  settings = {};
  settings2 = {
    actions: false,
    noDataMessage: 'データは空白となっています。',
    selectMode: 'multi',
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: {
        title: '社名',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 250,
            },
          };
          return obj;
        },
      },
      address: {
        title: '住所（登記上）',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 250,
            },
          };
          return obj;
        },
      },
      business: {
        title: '分野・業務区分',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 200,
            },
          };
          return obj;
        },
      },
      occupation: {
        title: '職種',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      work: {
        title: '作業',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      phone: {
        title: '電話番号',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      fax: {
        title: 'FAX番号',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      create_by: {
        title: '登録者',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      create_at: {
        title: '登録日時',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      change_by: {
        title: '最終更新者',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
      change_at: {
        title: '最終更新日時',
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: 150,
            },
          };
          return obj;
        },
      },
    },
  };
  isReset = false;
  isCreateAtError = false;
  isChangeAtError = false;
  isValidPage = true;
  done = false;
  createAtErrorMessage = '';
  changeAtErrorMessage = '';
  pageDetail = '';
  perPage = '10';

  constructor(
    private renderPageService: AitRenderPageService,
    public router: Router,
    public store: Store<AppState>,
    private dialogService: NbDialogService,
    // private translateService: AitTranslationService,
    // private changeDetectorRef: ChangeDetectorRef,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    apollo: Apollo,
    saveTempService: AitSaveTempService,
    private masterDataService: AitMasterDataService
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService,
      saveTempService
    );
  }

  ngDoCheck() {
    this.totalRows = this.source != null ? this.source.count() : 0;

    if (this.totalRows < +this.perPage) {
      this.isValidPage = false;
    } else {
      this.isValidPage = true;
    }

    // 306件中 1 - 100件
    if (this.totalRows > 0) {
      // {page: 2, perPage: 5}
      try {
        const currentPaging = this.source.getPaging();
        const num1 = (currentPaging.page - 1) * currentPaging.perPage + 1;
        const num2 = num1 + (currentPaging.perPage - 1);
        const num3 = num2 > this.totalRows ? this.totalRows : num2;
        this.pageDetail = `${this.totalRows}件中 ${num1} - ${num3}件`;
        this.left = this.getLeft(+currentPaging.page);
      } catch {}
    }
  }

  ngOnInit(): void {
    this.setupData();
  }

  async setupData() {
    const resModule = await this.renderPageService.findModule({
      code: this.module,
    });
    const resPage = await this.renderPageService.findPage({ code: this.page });
    console.log(resModule, resPage);
    if (
      resModule.status === RESULT_STATUS.OK &&
      resPage.status === RESULT_STATUS.OK
    ) {
      this.moduleKey = resModule.data[0]?._key || '';
      this.pageKey = resPage.data[0]?._key || '';

      const resGroup = await this.renderPageService.findGroup({
        module: this.moduleKey,
        page: this.pageKey,
      });
      if (resGroup.status === RESULT_STATUS.OK) {
        this.groupKey = resGroup.data[0]?._key || '';

        const resSearch = await this.renderPageService.findSearchCondition({
          module: this.moduleKey,
          page: this.pageKey,
          group: this.groupKey,
        });

        const resResult = await this.renderPageService.findSearchResult({
          module: this.moduleKey,
          page: this.pageKey,
          group: this.groupKey,
        });
        if (
          resSearch.status === RESULT_STATUS.OK &&
          resSearch?.data?.length > 0
        ) {
          this.searchComponents = resSearch.data;
          this.setupForm(this.searchComponents);
          this.setupComponent(this.searchComponents);
        }
        if (
          resResult.status === RESULT_STATUS.OK &&
          resResult.data?.length > 0
        ) {
          this.tableComponents = resResult.data;
          console.log(this.tableComponents);
          this.setupSetting(this.tableComponents);
        }
      }
    }
  }
  setupSetting(tableComponents: any[]) {
    const data = tableComponents[0];
    const columns = data['columns'] || [];
    const settings = data['settings'] || {};

    this.settings['actions'] = false;
    if (settings['no_data_message']) {
      this.settings['noDataMessage'] = settings['no_data_message'];
    }
    if (settings['select_mode']) {
      this.settings['selectMode'] = settings['select_mode'];
    }
    if (settings['paper']) {
      this.settings['paper'] = {};
      if (settings['paper']['display']) {
        this.settings['paper']['display'] = settings['paper']['display'];
      }
      if (settings['paper']['per_page']) {
        this.settings['paper']['per_page'] = settings['paper']['per_page'];
      }
    }

    this.settings['columns'] = {};

    columns.forEach((col : any) => {
      const obj = {
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {
          const obj = {
            text: value,
            style: {
              width: col.style?.width || '',
            },
          };
          return obj;
        },
      };
      obj['title'] = col.title || '';
      this.settings['columns'][col['name']] = obj;
    });

    this.setupTable(data);
  }
  async setupTable(setting: any) {
    const res = await this.masterDataService.getAllMasterData();
    const data = res.data as any[];
    this.source = new LocalDataSource(data);
    this.done = true;
  }

  setupForm(components: any[]) {
    const group = {};
    components.forEach((component) => {
      if (component.item_id) {
        if (
          component.type === 'date' &&
          component?.component_setting?.from_to
        ) {
          group[component.item_id + '_from'] = new FormControl();
          group[component.item_id + '_to'] = new FormControl();
        } else {
          group[component.item_id] = new FormControl();
        }
      }
    });
    this.searchForm = new FormGroup(group);
  }

  setupComponent(components: any[]) {
    const leftSide = [];
    const rightSide = [];
    components.forEach((component) => {
      if (component.col_no === 1) {
        leftSide.push(component);
      } else {
        rightSide.push(component);
      }
    });
    this.leftSide = leftSide.sort((a, b) => a.row_no - b.row_no);
    this.rightSide = rightSide.sort((a, b) => a.row_no - b.row_no);
  }

  toggleExpan = () => {
    this.isExpan = !this.isExpan;
    this.toggle.emit(this.isExpan);
  };

  toggleTableExpan = () => {
    this.isTableExpan = !this.isTableExpan;
    this.toggleTable.emit(this.isTableExpan);
  };

  getDefaultValue(data: any, numItem: number | unknown): any {
    if (numItem === 1) {
      return data ? [data] : null;
    } else {
      return data;
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(value);
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  takeMaster(
    value: KeyValueDto[] | KeyValueDto,
    form: string,
    numItem: number | unknown
  ): void {
    if (numItem === 1) {
      this.takeMasterValue(value, form);
    } else {
      this.takeMasterValues((value || []) as KeyValueDto[], form);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (isArrayFull(value)) {
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(value);
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string): void {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(value);
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  reset(event: any) {
    event.preventDefault();
    this.searchForm.reset();
    this.isCreateAtError = false;
    this.isChangeAtError = false;
    this.isReset = true;
    // this.clearTemp();
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.showToastr('', this.getMsg('I0007'));
  }

  search(event = null, isInit = false) {
    if (event) {
      event.preventDefault();
    }
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
    } else {
      console.log('form invalid');
    }
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

  changePage() {
    this.callLoadingApp();
    setTimeout(() => {
      this.source.setPaging(1, +this.perPage);
      this.cancelLoadingApp();
    }, 0);
  }

  getLeft(page: number): number {
    const length = (document.getElementsByClassName('ng2-smart-page-item') || []).length;
    if (length === 6) {
      return 405;
    }
    if (length === 7) {
      return 453;
    }
    if (page < 8) {
      return 503;
    } else if (page === 8) {
      return 511;
    } else if (page === 9) {
      return 519;
    } else if (page === 10) {
      return 527;
    } else {
      return 535;
    }
  }
}
