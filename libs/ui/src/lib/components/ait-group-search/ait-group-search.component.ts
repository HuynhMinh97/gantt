/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import {
  ChangeDetectorRef,
  Component,
  DoCheck,
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
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { AitTableButtonComponent } from '../ait-table-button/ait-table-button.component';
import { AitConfirmDialogComponent } from '../ait-confirm-dialog/ait-confirm-dialog.component';

@Component({
  selector: 'ait-group-search',
  templateUrl: './ait-group-search.component.html',
  styleUrls: ['./ait-group-search.component.scss'],
})
export class AitGroupSearchComponent
  extends AitBaseComponent
  implements OnInit, DoCheck {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('area') area: ElementRef;
  source: LocalDataSource;
  @Input() page: string;
  @Input() module: string;
  @Input() isExpan = false;
  @Input() isTableExpan = true;
  @Input() public find: (condition?: any, dataSearch?: any) => Promise<any>;
  @Output() toggle = new EventEmitter();
  @Output() toggleTable = new EventEmitter();
  searchForm: FormGroup;
  totalRows: number;
  left = 0;
  moduleKey = '';
  pageKey = '';
  groupKey = '';
  pageTitle = '';
  tableTitle = '';
  searchContent = '';
  searchComponents: any[] = [];
  tableComponents: any[] = [];
  leftSide: any[] = [];
  rightSide: any[] = [];
  selectedItems: any[] = [];
  settings = {};
  isReset = false;
  isCreateAtError = false;
  isChangeAtError = false;
  isValidPage = true;
  done = false;
  createAtErrorMessage = '';
  changeAtErrorMessage = '';
  pageDetail = '';
  perPage = '10';
  dataTable: any[] = [];
  nameFileCsv = '';
  hearder = [];
  pageRouter: any;
  pageButton: any;
  collection: string;
  columnTable = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngxCsvParser: NgxCsvParser,
    private renderPageService: AitRenderPageService,
    private translateService: AitTranslationService,
    public router: Router,
    public store: Store<AppState>,
    private dialogService: NbDialogService,
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
    this.callLoadingApp();
    try {
      const resModule = await this.renderPageService.findModule({
        code: this.module,
      });
      const resPage = await this.renderPageService.findPage({
        code: this.page,
      });
      if (
        resModule.status === RESULT_STATUS.OK &&
        resPage.status === RESULT_STATUS.OK
      ) {
        this.moduleKey = resModule.data[0]?.code || '';
        this.pageKey = resPage.data[0]?.code || '';
        this.pageTitle = resPage.data[0]?.name || '';

        this.pageRouter = resPage.data[0]?.router || null;
        this.pageButton = resPage.data[0]?.button || null;

        const resGroup = await this.renderPageService.findGroup({
          module: this.moduleKey,
          page: this.pageKey,
        });
        if (resGroup.status === RESULT_STATUS.OK && resGroup.data.length > 0) {
          const group = resGroup.data.find((e: any) => e['type'] === 'search');
          this.groupKey = group?.code || '';
          this.searchContent = group?.name || '';
          this.collection = resGroup.data[0]?.collection || '';

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
          } else {
            this.cancelLoadingApp();
          }
          if (
            resResult.status === RESULT_STATUS.OK &&
            resResult.data?.length > 0
          ) {
            this.tableTitle = resResult.data[0]?.name;
            this.tableComponents = resResult.data;
            this.setupSetting(this.tableComponents);
          } else {
            this.cancelLoadingApp();
          }
        } else {
          this.navigateTo404();
        }
      } else {
        this.navigateTo404();
      }
    } catch {
      this.cancelLoadingApp();
    }
  }

  navigateTo404() {
    this.cancelLoadingApp();
    this.router.navigate([`/404`]);
  }

  detail(data: any) {
    if (this.pageRouter) {
      this.router.navigate([`${this.pageRouter?.view || ''}`]);
    }
  }

  copy(data: any) {
    if (this.pageRouter) {
      this.router.navigate([`${this.pageRouter?.input || ''}`+ `/coppy/${data}`]);
    }
  }

  edit(data: any) {
    if (this.pageRouter) {
      this.router.navigate([`${this.pageRouter?.input || ''}`+ `/edit/${data}`]);
    }
  }

  delete(data: any, e: any) {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.onDelete(data || '');
        }
      });
  }

  async onDelete(_key: string) {
    const data = await this.source.getAll();
    const item = (data || []).find((e) => e._key === _key);
    this.callLoadingApp();
    try {
      await this.renderPageService.remove(this.collection, _key).then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          this.showToastr('', this.getMsg('I0003'));
          this.source.remove(item);
        } else {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } catch {
      this.cancelLoadingApp();
    } finally {
      this.cancelLoadingApp();
    }
  }

  setupSetting(tableComponents: any[],  diplay?: KeyValueDto[]) {
    try {
      console.log(tableComponents);
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

      this.settings['columns']['_key'] = {
        type: 'custom',
        filter: false,
        renderComponent: AitTableButtonComponent,
        onComponentInitFunction: (instance: any) => {
          instance?.detailEvent.subscribe((data: string) => this.detail(data));
          instance?.copyEvent.subscribe((data: string) => this.copy(data));
          instance?.editEvent.subscribe((data: string) => this.edit(data));
          instance?.deleteEvent.subscribe((data: string) =>
            this.delete(data, instance?.rowData)
          );
        },
      };
      if(!diplay){
        columns.forEach((col: any) => {
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
          this.hearder.push(col.name);
          obj['title'] = col.title || '';
          this.settings['columns'][col['name']] = obj;
          this.columnTable.push({ _key: col.name, value: col.title });
        });
        this.setupTable();
      }else{
        // this.callLoadingApp();
        columns.forEach((col: any) => {
          if(diplay.find(element => element._key == col.name)){
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
          }
        });
        if(diplay.length == 0){
          delete this.settings['columns']['_key'];
          delete this.settings['selectMode'];
        }
        console.log(this.settings);
        
        this.done = false;
        setTimeout(() =>{
          this.done = true;
          this.cancelLoadingApp();
        },200)
      }
    } catch {
      this.cancelLoadingApp();
    }
  }
  async setupTable() {
    try {
      const conditions = this.getSearchCondition();
      if (this.find) {
        const res = await this.find(conditions);        
        const data = res.data as any[];
        this.dataTable = data;
        this.source = new LocalDataSource(data);
        console.log(this.source);
        this.done = true;
      } else {
        const res = await this.renderPageService.findAllDataByCollection(
          this.collection,
          conditions
        );
        if (res && res.status === RESULT_STATUS.OK && res.data.length > 0) {
          const data = this.getDataFromJSON(res.data as any[]);
          this.dataTable = data;
          this.source = new LocalDataSource(data);
          this.done = true;
        }
      }
      this.focusToTable();
    } catch {
      this.cancelLoadingApp();
    } finally {
      this.cancelLoadingApp();
    }
  }
  getSearchCondition() {
    const conditions = {};
    try {
      (this.searchComponents || []).forEach((e) => {
        if (e['search_setting']) {
          const prop = Object.entries(e['search_setting']).reduce(
            (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
            {}
          );
          conditions[e['item_id']] = prop;
        }
      });
    } catch {}

    return conditions;
  }
  getDataFromJSON(data: any[]) {
    const returnData = [];
    data.forEach((item) => {
      if (item) {
        try {
          returnData.push(JSON.parse(item.data));
        } catch {}
      }
    });

    return returnData;
  }

  setupForm(components: any[]) {
    try {
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
    } catch {
      this.cancelLoadingApp();
    }
  }

  setupComponent(components: any[]) {
    try {
      let leftSide = [];
      let rightSide = [];
      components.forEach((component) => {
        if (component.col_no === 1) {
          leftSide.push(component);
        } else {
          rightSide.push(component);
        }
      });
      leftSide = leftSide.sort((a, b) => a.row_no - b.row_no);
      rightSide = rightSide.sort((a, b) => a.row_no - b.row_no);

      const leftSideIndex = leftSide[leftSide.length - 1]?.row_no;
      const rightSideIndex = rightSide[rightSide.length - 1]?.row_no;
      try {
        [...Array(+leftSideIndex)].forEach((e, i) => {
          const item = leftSide.find((m) => m.row_no == i + 1);
          if (item) {
            this.leftSide.push(item);
          } else {
            this.leftSide.push({ type: 'space' });
          }
        });

        [...Array(+rightSideIndex)].forEach((e, i) => {
          const item = rightSide.find((m) => m.row_no == i + 1);
          if (item) {
            this.rightSide.push(item);
          } else {
            this.rightSide.push({ type: 'space' });
          }
        });
      } catch (e) {
        console.error(e);
      }
    } catch {
      this.cancelLoadingApp();
    }
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

  async search(event = null, isInit = false) {
    if (event) {
      event.preventDefault();
    }
    if (this.searchForm.valid) {
      const conditions = this.getSearchCondition();
      if (this.find) {
        const res = await this.find(conditions, this.searchForm.value);
        const data = res.data as any[];
        this.dataTable = data;
        this.source = new LocalDataSource(data);
      }
      this.focusToTable();
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
    const length = (
      document.getElementsByClassName('ng2-smart-page-item') || []
    ).length;
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

  ngAfterViewChecked(): void {
    this.syncTable();
  }
  syncTable() {
    if (this.table) {
      this.table.grid.getRows().forEach((row) => {
        if (this.selectedItems.find((r) => r._key == row.getData()._key)) {
          row.isSelected = true;
        }
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  settingColumnTable(value: KeyValueDto[]){
    console.log(value);
    
    const data = [];
    value.forEach((file) => {
      data.push(file);
    });
    this.setupSetting(this.tableComponents,data);
  }

  exportCsv() {
    const dayNow = Date.now();
    this.nameFileCsv = this.collection + dayNow.toString();
    let data = [];
    if(this.selectedItems.length > 0){
      data = this.selectedItems;
    }else {
      data = this.dataTable;
    }
    return data;
  } 

  deleteAll(isDelete){
    if(isDelete){
      this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          for(const item of this.selectedItems){
            console.log(item._key);
            this.onDelete(item._key);
          }
          this.selectedItems = [];
        }
      });
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
    } catch {
    }
  }
  
}
