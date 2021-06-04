/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RESULT_STATUS } from '@ait/shared';
import {
  AfterViewChecked,
  ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { TYPE } from '../../@constant';
import { AitMasterDataService, AitTranslationService, CLASS, DATA_TYPE } from '../../services';
import { AppState, getLang } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';



@Component({
  selector: 'ait-autocomplete-master',
  styleUrls: ['./ait-autocomplete-master.component.scss'],
  templateUrl: './ait-autocomplete-master.component.html',
})
export class AitAutoCompleteMasterComponent implements OnInit, AfterViewChecked, OnChanges {

  inputControlMaster: FormControl = new FormControl('');
  currentLang = 'en_US';
  constructor(
    private cdr: ChangeDetectorRef,
    private masterDataService: AitMasterDataService,
    store: Store<AppState>,
    private translateService: AitTranslationService) {
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
  dataSource: any[] = [];
  optionSelected: any[] = [];
  dataSourceDf = [];
  selectItems = [];
  filteredData = [];
  storeDataDraft = [];
  currentDataDef: any;
  @Input()
  placeholder = 'Default';

  isNew = false;
  @Input() maxItem = 1;
  @Input() icon = 'search-outline';
  @Input() widthInput = 300;
  @Input() defaultValue: any;
  @Input() type = '';
  @Input() maxLength = 200;
  @Input() excludedList: any[] = [];
  @Input() isReset = false;
  @Output() watchValues = new EventEmitter();
  @Output() getDefaultValue = new EventEmitter();

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngAfterViewChecked() {
    //your code to update the model
    // this.inputControl = new FormControl('');
    // this.cdr.detectChanges();
  }

  viewHandle(opt) {
    return opt?.value;
  }

  checkDefaultValue(data) {
    if (data.length > 1) {
      return false;
    } else {
      return AitAppUtils.isObjectValueEmpty(data[0]);
    }
  }

  getTitle = () => {
    return this.translateService.translate('c_10013');
  }

  compareDeep = (agr1: any, agr2: any) => JSON.stringify(agr1) === JSON.stringify(agr2);

  ngOnChanges(changes: SimpleChanges) {

    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        // const element = changes[key].currentValue;
        if (key === 'isReset') {
          if (this.isReset) {
            this.selectItems = [];
            this.defaultValue = [];
            setTimeout(() => {
              this.isReset = false;
            }, 200)
          }
        }
        if (!this.compareDeep(this.defaultValue, this.currentDataDef) && this.defaultValue) {

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

  getLimitInput = () => {
    const value = `${this.maxItem - (this.maxItem - this.selectItems.length)}/${this.maxItem}`;
    const message = this.translateService.translate('c_10010')
    return message.replace('{0}', value);
  }


  getPlaceholder = () => {
    if (this.selectItems.length !== 0) {
      return this.placeholder;
    }
    if (this.maxItem < 2) {
      return this.placeholder;
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
      this.watchValues.emit({ value: [{ _key: null, value }] });
    }

    else if (
      this.isNew
      && this.maxItem !== 1
      && this.selectItems.length < this.maxItem
    ) {
      this.selectItems = [...this.selectItems, { _key: null, value }];
      this.watchValues.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
    }
  }

  handleInput($event) {
    if ($event.value === '') {
      this.filteredData = [];
    }
  }

  getDefaultValueByLang = async (keys: string[]) => {
    this.masterDataService.getSuggestData({
      type: this.type,
      _key: keys
    }).then(r => {
      const result = r.data;
      this.selectItems = [...(result || []), ...this.storeDataDraft];
    })
  }


  settingData2 = () => {
    //call api # master data
    this.inputControlMaster.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(text => {
      const condition = {
        name: text
      }
      const returnFields = {
        _key: true,
        name: true
      }
      this.masterDataService.find(condition, returnFields, TYPE[this.type]).then(r => {
        if (r.status === RESULT_STATUS.OK) {
          this.dataSource = (r.data || []).map(m => ({ _key: m._key, value: m?.name }));
          const _keys = this.excludedList.map(e => e?._key);
          if (_keys.length !== 0) {
            this.filteredData = AitAppUtils.deepCloneArray(this.dataSource).filter(f => !_keys.includes(f._key));
          }
          else {
            this.filteredData = AitAppUtils.deepCloneArray(this.dataSource);
          }

        }
      })
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
    this.isNew = dataIsNews.includes(this.type);
  }

  ngOnInit() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // this.checkIsNewData().then(() => {

    // })

    this.getDefaultValue.emit({ value: (this.defaultValue || []).map(m => ({ _key: m?._key, value: m?.value })) })
    this.settingData2();


  }

  getSelectedOptions = () => this.dataSource.filter(f => f.isChecked).map(m => ({ _key: m?.code, value: m?.value }));

  checkItem = (event: Event, opt: any) => {
    this.inputControlMaster.patchValue('');
    const itemFind = this.filteredData.find(f => f.optionId === opt.optionId);

    itemFind.isChecked = !itemFind.isChecked;
    this.optionSelected = this.getSelectedOptions();

    this.watchValues.emit({ value: this.optionSelected });

  }

  getFilteredData = () => {
    const _keys = (this.selectItems || []).map(m => m._key);
    this.filteredData = this.dataSource.filter(f => !_keys.includes(f._key));
  }

  addItems = (info) => {
    const itemFind = this.filteredData.find(f => f._key === info?._key);
    if (this.maxItem === 1) {
      this.selectItems = [itemFind];
      this.watchValues.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
    }
    else {
      if (this.selectItems.length < this.maxItem) {
        this.selectItems = [...this.selectItems, itemFind];
        this.watchValues.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
      }
    }
    this.getFilteredData()
  }

  removeItems = (info) => {

    if (this.maxItem === 1) {
      this.selectItems = [];
      this.watchValues.emit({ value: [] });
    }
    else {
      const find = this.dataSource.find(f => f._key === info?._key);


      if (!find) {
        this.selectItems = this.selectItems.filter(f => f._key !== info?._key);

        this.watchValues.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
      }
      else {
        this.selectItems = this.selectItems.filter(f => f._key !== find?._key);

        this.watchValues.emit({ value: this.selectItems.map(m => ({ _key: m?._key, value: m?.value })) });
      }

    }
    this.getFilteredData()
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
    this.filteredOptions$ = of(this.dataSource);

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
    const result = this.dataSource.filter(f => {
      const target = f?.value;
      return target.toString().toLowerCase().includes(filterValue);
    })
    return filterValue !== '' ? result : this.dataSourceDf;
  }

}
