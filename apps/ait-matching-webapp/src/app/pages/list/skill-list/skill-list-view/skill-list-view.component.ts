import { isArrayFull, isObjectFull, isString, KEYS, OPERATOR, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTableButtonComponent,
  AitTranslationService,
  AppState,
  getLang,
  getUserSetting,
} from '@ait/ui';

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillListService } from '../../../../services/skill-list.service';
import dayjs from 'dayjs';

import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { SkillRegisterService } from '../../../../services/add-skill.service';

@Component({
  selector: 'ait-skill-list-view',
  templateUrl: './skill-list-view.component.html',
  styleUrls: ['./skill-list-view.component.scss'],
})


export class SkillListViewComponent extends AitBaseComponent implements OnInit {
  @ViewChild('area') area: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  source: LocalDataSource;
  settingTable: any;
  searchSkill: FormGroup;
  nameFileCsv = '';
  max_sort_no = 0;
  

  dateFormat: string;
  dataExport: any[] = [];
  selectedItems: any[] = [];
  selectedItemsMemory: any[] = [];
  totalRows: number;
  dataTable: any[] = [];
  isReset = false;
  done = false;
  isChangeAtError = false;
  isCreateAtError = false;
  isValidPage = true;
  left = 0;
  perPage = '10';
  language = '';
  createAtErrorMessage = [];
  changeAtErrorMessage = [];
  pageDetail = '';
  user_key = '';
  dateAtributes = [
    'create_at_from',
    'create_at_to',
    'change_at_from',
    'change_at_to',
  ];
  UserJobQueryAttribute = [
    'prefecture',
    'business',
    'residence_status',
    'desired_salary_from',
    'desired_salary_to'
  ];
  userAttribute = [
    'create_by',
    'change_by'
  ];
  
  columns = [
    {value: 'Name',_key: 'name',},
    {value: 'Code',_key: 'code',},
    {value: 'Category',_key: 'category',},
    {value: 'Create By',_key: 'create_by',},
    {value: 'Create At',_key: 'create_at',},
    {value: 'Change By',_key: 'change_by',},
    {value: 'Change At',_key: 'change_at',}
  ]
  columnExport = ['name', 'code', 'category', 'create_by', 'create_at', 'change_by', 'change_at',];
  constructor(
    public router: Router,
    private skillListService: SkillListService,
    private changeDetectorRef: ChangeDetectorRef,
    // private skillRegisterService: SkillRegisterService,
    private translateService: AitTranslationService,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
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
    this.searchSkill = this.formBuilder.group({
      name: new FormControl(null),
      code: new FormControl(null),
      category: new FormControl(null),
      create_by: new FormControl(null),
      change_by: new FormControl(null),
      change_at_to: new FormControl(null),
      create_at_to: new FormControl(null),
      change_at_from: new FormControl(null),
      create_at_from: new FormControl(null),
    });

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    store.pipe(select(getLang)).subscribe((lang) => {
      this.language = lang;
    })

    this.setModulePage({
      module: 'skill_list',
      page: 'skill_list',
    });

    
  }

  ngOnInit() {
    this.callLoadingApp();
  }

  reset() {
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.searchSkill.reset();
    this.isCreateAtError = false;
    this.isChangeAtError = false;
  }

  new() {
    this.router.navigate([`add-skill`]);
  }
  deleteAll(data) {
    if (this.selectedItems.length > 0 && data) {
      this.dialogService.open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
        },
      })
        .onClose.subscribe(async (event) => {
          if (event) {
            try {
              this.callLoadingApp();
              let count = 0;
              for (const i of this.selectedItems) {
                await this.skillListService.removeSkillByKey(i._key)
                  .then((res) => {
                    if (res.status === RESULT_STATUS.OK) {
                      count++;
                    } else {
                      this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
                    }
                  })
              }
              setTimeout(() => { this.selectedItems = [] }, 1000)
              if (count > 0) {
                this.showToastr('', this.getMsg('I0003'));
                this.getData();
                this.cancelLoadingApp();
              }else{
                this.cancelLoadingApp();
              }
            } catch (error) {
              this.cancelLoadingApp();
            }
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
    } catch {}
  }

  ngDoCheck() {
    this.totalRows = this.source != null ? this.source.count() : 0;
    if (this.totalRows <= +this.perPage) {
      this.isValidPage = false;
    } else {
      this.isValidPage = true;
    }
    // 306件中 1 - 100件
    if (this.totalRows > 0) {
      // {page: 2, perPage: 5}
      try {
        const outOf = this.translateService.translate('件中');
        const cases = this.translateService.translate('件');
        const currentPaging = this.source.getPaging();
        const num1 = (currentPaging.page - 1) * currentPaging.perPage + 1;
        const num2 = num1 + (currentPaging.perPage - 1);
        const num3 = num2 > this.totalRows ? this.totalRows : num2;
        if (this.language === 'ja_JP')
        {
          this.pageDetail = `${this.totalRows} ${outOf} ${num1} - ${num3} ${cases}`;
          
        } else {
          this.pageDetail = `${num1} - ${num3} ${outOf} ${this.totalRows} ${cases}`;
        }
        
        this.left = this.getLeft(+currentPaging.page);
      } catch {
      }
    }
  }

  getLeft(page: number): number {
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

  
  getOperator(key: string) {
    if (key === 'create_at_from' || key === 'change_at_from' || key === 'desired_salary_from') {
      return OPERATOR.GREATER_OR_EQUAL;
    } else {
      return OPERATOR.LESS_OR_EQUAL;
    }
  }
  async getData(object?: any) {
    const dataSearch = [];
    await this.skillListService.searchSkill(object).then((res) => {
      if (res?.status === RESULT_STATUS.OK) {
        this.dataTable = [];
        const data = res.data;
        if (data.length > 0) {
          data.forEach(element => {
            const dataFormat = {};
            dataFormat['name'] = element?.name;
            dataFormat['code'] = element?.code;
            dataFormat['_key'] = element?._key;
            dataFormat['category'] = element?.category.value;
            dataFormat['create_by'] = element?.create_by;
            dataFormat['change_by'] = element?.change_by;
            dataFormat['create_at'] = this.getDateFormat(element?.create_at);
            dataFormat['change_at'] = this.getDateFormat(element?.change_at);
            dataSearch.push(dataFormat);
          });
        }
      }
    })
    console.log(dataSearch);
    this.source = new LocalDataSource(dataSearch);
    return dataSearch;
  }


  public search = async (condition = {},data = {}) => {
    this.searchSkill.patchValue({ ...data});
    if (this.searchSkill.valid && !this.isChangeAtError && !this.isCreateAtError ) {
      const object = {};
      Object.keys(this.searchSkill.controls).forEach((key) => {
        const value = this.searchSkill.controls[key].value;
        if (value) {
          if (this.dateAtributes.includes(key)) {
            object[key] = {
              target: (key.slice(0, 9) || ''),
              operator: this.getOperator(key),
              valueAsNumber: value
            }
          } else if (this.userAttribute.includes(key)) {
            try {
              if (!object[key]) {
                object[key] = {operator: OPERATOR.LIKE};
              }
              object[key]['value'] = value;
            } catch (e) {
            }
          }
          
          else {
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
        return { data: data}
      } else {
        const data = await this.getData();
        this.focusToTable();
        return { data: data}
      }
    }
    else {
      const data = await this.getData();
        this.focusToTable();
        return { data: data}
    }
  }

  

  exportCsv() {

    const dayNow = Date.now();
    this.nameFileCsv = 'skill' + dayNow.toString();
    let data = [];
    if (this.selectedItems.length > 0) {
      data = this.selectedItems;
    } else {
      data = this.dataTable;
    }
    return data;
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  

  
}
