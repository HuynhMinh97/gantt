/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CompanyInfoDto, RESULT_STATUS } from '@ait/shared';
import {
  AfterViewChecked,
  ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import {
  AitAuthService,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AitUserService,
  CLASS,
  DATA_TYPE
} from '../../services';
import { AppState, getLang } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';
import { AitBaseComponent } from '../base.component';



@Component({
  selector: 'ait-autocomplete-master',
  styleUrls: ['./ait-autocomplete-master.component.scss'],
  templateUrl: './ait-autocomplete-master.component.html',
})
export class AitAutoCompleteMasterComponent extends AitBaseComponent implements OnInit, AfterViewChecked, OnChanges {

  inputControlMaster: FormControl = new FormControl('');
  currentLang = 'en_US';
  constructor(
    private cdr: ChangeDetectorRef,
    private masterDataService: AitMasterDataService,
    store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    userService: AitUserService, _env: AitEnvironmentService,
    private translateService: AitTranslationService) {
    super(store, authService, apollo, userService, _env);
    store.pipe(select(getLang)).subscribe(
      lang => {
        if (lang !== this.currentLang) {
          this.currentLang = lang;
          const _keys = (this.selectItems || []).map(m => m?._key);
          if (_keys.length !== 0) {
            this.getDefaultValueByLang(_keys).then();
          }
        }
      }
    )
  }



  // Otherwise, maxItem=1 => chon se show chip len input (chon xong 1 cai se replace cho cai chip o tren input)
  // O truong hop nay, neu isNew la true se emit ra screen cai text {value : val}  dc danh' vao` (maxITem =1),
  // isNew la false, thi` chi emit nhung cai co trong dataSource (maxItem=1)
  // O truong hop maxItem>1 thi`, neu isNew la` true cho phep chon trong data source lan~ cho emit cai moi ra ngoai`

  filteredOptions$: Observable<any>;
  DataSource: any[] = [];
  optionSelected: any[] = [];
  dataSourceDf = [];
  selectItems = [];
  filteredData = [];
  storeDataDraft = [];
  currentDataDef: any;
  @Input()
  placeholder = 'Default';
  @ViewChild('input', { static: false }) input: ElementRef;
  isOpenSuggest = false;

  isNew = false;
  @Input() maxItem = 1;
  @Input() icon = 'search-outline';
  @Input() widthInput = 300;
  @Input() defaultValue: any;
  @Input() maxLength = 200;
  @Input() excludedValue: any[] = [];
  @Input() isReset = false;
  @Output() watchValue = new EventEmitter();
  @Output() getDefaultValue = new EventEmitter();
  @Input() isError = false;
  @Input() required = false;
  @Input() label;
  errors = []
  @Input() guidance = ''
  @Input() guidanceIcon = 'info-outline';
  @Input() collection;
  @Input() dataSource: any[] = [];
  @Input() classContainer;
  @Input() dataTooltip = [];
  @Input() disabled = false;
  isShowTooltip = false;
  @Input() id;
  @Input() isSubmit = false;
  @Input()
  includeNotActive = false;
  @Input()
  includeNotDelete = true;
  @Output() onError = new EventEmitter();
  messageSearch = '';

  ID(element: string) {
    return this.id + '_' + element;
  }

  getCaptions = () => this.translateService.translate(this.guidance);


  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngAfterViewChecked() {
    //your code to update the model
    // this.inputControl = new FormControl('');
    // this.cdr.detectChanges();
  }

  getFieldName = () => this.translateService.translate(this.label);

  getInfo = () => {
    const msg = this.translateService.getMsg('I0044');
    const res = (msg || '').replace('{0}', this.maxItem).replace('{1}', this.getFieldName());
    return res;
  }

  viewHandle(opt) {
    return opt?.value;
  }

  getDataTooltip = (_key: string) => {
    const company: CompanyInfoDto = this.dataTooltip.find(f => f._key === _key);
    const result = [
      { field: 'address', value: company?.address },
      { field: 'occupation', ...company?.occupation },
      { field: 'work', ...company?.work },
    ]

    if (result.map(m => this.getContent(m)).filter(f => !!f).length > 0) {
      this.isShowTooltip = true;
    }
    else {
      this.isShowTooltip = false;
    }
    const comma = this.translateService.translate('s_0001');
    return result.map(m => this.getContent(m)).filter(f => !!f).join(comma || '、')
  }

  getContent = (data) => {
    const fieldName = {
      address: '住所',
      occupation: '職種',
      work: '作業'
    }
    return data?.value ? `・${this.translateService.translate(fieldName[data?.field])}：${data.value}` : '';
  }

  checkDefaultValue(data) {
    const target = !data ? [] : data.map(m => m?.value).filter(x => !!x);
    if (target.length > 1) {
      return false;
    } else {
      return AitAppUtils.isObjectValueEmpty(data[0] || {});
    }
  }

  getTitle = () => {
    return this.translateService.translate('c_10013');
  }

  compareDeep = (agr1: any, agr2: any) => JSON.stringify(agr1) === JSON.stringify(agr2);

  getUniqueSelection = (arr: any[]) => {
    const res = [];
    arr.forEach(item => {
      if (!res.includes(item?.value)) {
        res.push(item)
      }
    })
    return AitAppUtils.getArrayNotFalsy(res);
  }

  ngOnChanges(changes: SimpleChanges) {

    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        // const element = changes[key].currentValue;
        if (key === 'isSubmit') {
          if (this.isSubmit) {
            if (this.inputControlMaster.value === '' && this.selectItems.length === 0) {
              this.isError = true;
              const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
              this.errors = [err]
            }
            this.isSubmit = false;
          }
        }
        if (key === 'required') {
          // console.log(this.required)
        }
        if (key === 'isReset') {
          if (this.isReset) {
            this.selectItems = [];
            this.errors = [];
            this.isError = false;
            this.onError.emit({ isValid: null });
            this.messageSearch = '';
            setTimeout(() => {
              this.isReset = false;
            }, 200)
          }
        }
        if (!this.compareDeep(this.defaultValue, this.currentDataDef)) {
          console.log(this.defaultValue)
          this.currentDataDef = this.defaultValue;
          const checkNull = this.checkDefaultValue(this.defaultValue);
          this.selectItems = checkNull ? [] : this.defaultValue;
          const getObjecKeyEqualNull = this.selectItems.filter(s => !s?._key);
          this.storeDataDraft = getObjecKeyEqualNull;
          const _keys = this.selectItems.map(m => m?._key);
          if (_keys.length !== 0) {
            this.getDefaultValueByLang(_keys).then(
            );
          }
          else {
            this.selectItems = [...this.storeDataDraft];
          }
        }
      }
    }
  }

  getEmptyMessage = (data: any[]) => {
    const message = this.translateService.translate('データがありません。')

    return data.length !== 0 ? '' : message;
  }

  getLimitInput = () => {
    const value = `${this.maxItem - (this.maxItem - this.selectItems.length)}/${this.maxItem}`;
    const message = this.translateService.translate('c_10010')
    return message.replace('{0}', value);
  }


  getPlaceholder = () => {
    if (this.selectItems.length === 0) {
      return this.placeholder;
    }
    if (this.maxItem < 2) {
      return this.selectItems.length === 0 ? this.placeholder : '';
    }
    return this.isNew ?
      this.translateService.translate('c_10011') :
      this.translateService.translate('c_10012');
  }

  enterItems = (value) => {
    if (this.isNew
      && this.maxItem === 1
      && this.selectItems.length === 0
      && this.selectItems.length < this.maxItem
    ) {
      this.selectItems = [{ _key: null, value }];
      this.watchValue.emit({ value: [{ _key: null, value }] });
    }

    else if (
      this.isNew
      && this.maxItem !== 1
      && this.selectItems.length < this.maxItem
    ) {
      this.selectItems = [...this.selectItems, { _key: null, value }];
      this.watchValue.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
    }
  }

  clearErrors = () => {
    this.errors = [];
    this.isError = false;
  }

  checkReq = (value?: any) => {
    if (this.required) {
      if (!value) {
        this.isError = true;
        const msg = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.errors = Array.from(new Set([...this.errors, msg]));
        this.onError.emit({ isValid: false });
      }
      else {
        this.errors = [];
        if (this.errors.length === 0) {
          this.isError = false;
          this.onError.emit({ isValid: true });

        }

      }
    }
  }

  handleInput($event) {
    this.clearErrors();
    if (this.required) {
      if ($event.value === '' && this.selectItems.length === 0) {
        this.isError = true;
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.errors = [err]
      }
    }
    if ($event.value === '') {
      this.filteredData = [];
      this.messageSearch = '';

    }
  }

  outFocus = () => {
    this.clearErrors();
    this.inputControlMaster.reset();
    this.messageSearch = '';
    if (this.required) {
      if (this.selectItems.length === 0) {
        this.isError = true;
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.errors = [err]
      }
    }
  }

  getDefaultValueByLang = async (keys: string[]) => {
    const condition = {
      _key: keys[0]
    }
    const returnFields = {
      _key: true,
      name: true
    }

    this.masterDataService.find(condition, returnFields, this.collection, this.includeNotDelete, this.includeNotActive).then(r => {
      if (r?.status === RESULT_STATUS.OK) {
        console.log(r.data)
        const result = r.data.map(m => ({ ...m, value: m?.name }));
        this.selectItems = [...(result || []), ...this.storeDataDraft];
      }
    })

  }


  settingData2 = () => {
    //call api # master data
    this.inputControlMaster.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(text => {
      // console.log(text)
      if (text) {
        const condition = {
          name: text
        }
        const returnFields = {
          _key: true,
          name: true
        }
        this.masterDataService.find(condition, returnFields, this.collection, this.includeNotDelete, this.includeNotActive).then(r => {
          if (r.status === RESULT_STATUS.OK) {
            this.DataSource = (r.data || []).map(m => ({ _key: m._key, value: m?.name }));
            const _keys = this.excludedValue.map(e => e?._key);
            if (_keys.length !== 0) {
              this.filteredData = AitAppUtils.deepCloneArray(this.DataSource).filter(f => !_keys.includes(f._key));
              this.messageSearch = this.getEmptyMessage(this.filteredData);
            }
            else {
              this.filteredData = AitAppUtils.deepCloneArray(this.DataSource);
              this.messageSearch = this.getEmptyMessage(this.filteredData);

            }
            this.isOpenSuggest = true;
          }
        })
      }
      else {
        this.DataSource = [];
        this.filteredData = [];
        this.messageSearch = '';

      }
    })
  }

  checkIsNewData = async () => {
    const res = await this.masterDataService.getSuggestData({
      type: DATA_TYPE.MASTER,
      class: CLASS.SYSTEM_SETTING
    });
    const data = res?.data || [];
    const dataIsNews = data.filter(d => {
      if (!d.value) {
        return false;
      }
      if (typeof d.value === 'string') {
        return d.value.toUpperCase() === 'TRUE'
      }
      return !!d.value;
    }).map(m => {
      const symbols = m.code.replace('_INPUT_INSERT_NEW', '');
      return symbols
    });
    this.isNew = dataIsNews.includes(this.collection);
  }

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // this.checkIsNewData().then(() => {

    // })

    this.getDefaultValue.emit({ value: (this.defaultValue || []).map(m => ({ _key: m?._key, value: m?.value })) })
    this.settingData2();


  }

  getSelectedOptions = () => this.DataSource.filter(f => f.isChecked).map(m => ({ _key: m?.code, value: m?.value }));

  checkItem = (event: Event, opt: any) => {
    this.inputControlMaster.patchValue('');
    const itemFind = this.filteredData.find(f => f.optionId === opt.optionId);

    itemFind.isChecked = !itemFind.isChecked;
    this.optionSelected = this.getSelectedOptions();

    this.watchValue.emit({ value: this.optionSelected });

  }

  getFilteredData = () => {
    const _keys = (this.selectItems || []).map(m => m._key);
    this.filteredData = this.DataSource.filter(f => !_keys.includes(f._key));
    if (this.filteredData.length !== 0) {
      this.messageSearch = this.getEmptyMessage(this.filteredData);
    }
    else {
      this.messageSearch = '';
    }

  }

  addItems = (info) => {

    const itemFind = this.filteredData.find(f => f._key === info?._key);
    if (this.maxItem === 1) {
      this.selectItems = [itemFind];
      this.watchValue.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
    }
    else {
      if (this.selectItems.length < this.maxItem) {
        this.selectItems = [...this.selectItems, itemFind];
        this.watchValue.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
      }
    }
    this.getFilteredData();
    if (this.required) {
      if (this.selectItems.length === 0) {
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.isError = true;
        this.errors = [err]
      }
      else {
        this.isError = false;
        this.clearErrors();
      }
    }
    setTimeout(() => {
      this.isOpenSuggest = false

    }, 100)
  }

  removeItems = (info) => {

    if (!this.disabled) {
      if (this.maxItem === 1) {
        this.selectItems = [];
        this.watchValue.emit({ value: [] });
      }
      else {
        const find = this.DataSource.find(f => f._key === info?._key);


        if (!find) {
          this.selectItems = this.selectItems.filter(f => f._key !== info?._key);

          this.watchValue.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
        }
        else {
          this.selectItems = this.selectItems.filter(f => f._key !== find?._key);

          this.watchValue.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
        }

      }
      this.getFilteredData()
      if (this.required) {
        if (this.selectItems.length === 0) {
          const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
          this.isError = true;
          this.errors = [err]
        }
        else {
          this.clearErrors();
        }
      }
    }
  }

  displayOptions = () => {
    const res2 = this.optionSelected.map(m => m.value);
    return this.optionSelected.length !== 0 ? res2.join(', ') : ''
  }

  optionClicked(event: Event, opt: any) {
    this.inputControlMaster.patchValue('');
    this.checkItem(event, opt)
    event.stopPropagation();
  }

  disableClickCheckbox = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => { };
    event.checked = false;
    return false;
  }

  handleClick = () => {
    this.filteredOptions$ = of(this.DataSource);

  }



  getSelectedItems = (data: any[]) => {
    if (data.length === 1) {
      const statement = data[0]?.value;
      return statement
    }
    else if (data.length > 1) {
      const statements = data.map(m => m?.value);
      const statement = statements[0];
      return statement + ' & ' + `${statements.length - 1} items`;
    }
    return ''
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toString().toLowerCase();
    const result = this.DataSource.filter(f => {
      const target = f?.value;
      return target.toString().toLowerCase().includes(filterValue);
    })
    return filterValue !== '' ? result : this.dataSourceDf;
  }

}
