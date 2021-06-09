/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RESULT_STATUS } from '@ait/shared';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { AitAuthService, AitEnvironmentService, AitMasterDataService, AitUserService } from '../../services';
import { AppState, } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';
import { AitBaseComponent } from '../base.component';



@Component({
  selector: 'ait-autocomplete-master-data',
  styleUrls: ['./ait-autocomplete-master-data.component.scss'],
  templateUrl: './ait-autocomplete-master-data.component.html',
})
export class AitAutoCompleteMasterDataComponent extends AitBaseComponent
  implements OnInit, AfterViewChecked, OnChanges {

  inputControl: FormControl;
  currentLang = 'ja_JP';
  currentCompany = '';
  @Input() isShow = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private masterDataService: AitMasterDataService,
    store: Store<AppState>,
    private eRef: ElementRef,
    authService: AitAuthService,
    userService: AitUserService,
    _envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, userService, _envService);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.inputControl = new FormControl({ value: '', disabled: this.isReadOnly });
    this.currentLang = this.lang;
  }
  isOpenAutocomplete = false;
  // NOTE isNew k co tac dung vs master data

  // tslint:disable-next-line: max-line-length
  // eslint-disable-next-line max-len
  // Neu la type master data thi` maxItem=1 => giong nhu select (ho tro autocomplete), maxItem > 1  show giong nhu auto muti choice , nhung ho tro autocomplete
  // emit {_key : code ,value}
  filteredOptions$: Observable<any>;
  dataSource: any[] = [];
  optionSelected: any[] = [];
  dataSourceDf = [];
  selectOne: any;
  isClickedIcon = false;
  defaultValueDf: any;
  data = [];

  @ViewChild('autoInput', { static: false }) auto: ElementRef;
  @ViewChild('input', { static: false }) input: ElementRef;
  @Input() class: string;
  @Input() parentCode: string;
  @Input() code: string;
  @Input()
  placeholder: string = '';
  @Input() maxItem: number = 0;
  @Input() icon: string = 'search-outline';
  @Input() widthInput: number = 400;
  @Input() defaultValue: any[] = [];
  @Input() style: any;
  @Input() styleInput: any;
  @Output() watchValues = new EventEmitter();
  @Output() onInput = new EventEmitter();
  @Output() onInputValues = new EventEmitter();
  @Output() outFocusValues = new EventEmitter();
  isDropDownList = false;
  @Input() isReadOnly = false;
  @Input() disableOutputDefault = false;
  @Input() isResetInput = false;

  isHideLabel = false;
  isClickOption = false;

  openAutocomplete = () => this.isOpenAutocomplete = true;
  hideAutocomplete = () => {
    this.isOpenAutocomplete = false;

  }


  ngAfterViewChecked() {
    // your code to update the model
    this.cdr.detectChanges();
  }

  get PLACEHOLDER(): string {
    if (this.maxItem === 1) {
      if (this.selectOne?.value) {
        return this.selectOne?.value || '';
      }
      return this.placeholder || '';
    }
    else if (this.maxItem !== 1) {
      return this.optionSelected.length < 1 ? this.placeholder : '';
    }
    return '';
  }

  get VALUE(): string {
    // console.log(this.selectOne?.value, this.defaultValue[0]?.value, '')
    if (!this.defaultValue) {
      return this.selectOne?.value || ''
    }
    if (this.maxItem === 1) {
      return this.selectOne?.value || this.defaultValue[0]?.value || ''
    }
    else {
      return '';
    }
  }

  compareDeep = (agr1: any, agr2: any) => JSON.stringify(agr1) === JSON.stringify(agr2);

  ngOnChanges(changes: SimpleChanges) {
    if (this.parentCode) {
      this.selectOne = {};
      this.settingData();
    }
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {

        if (this.parentCode && key === 'parentCode') {
          this.settingData();
        }
        if (this.defaultValue && key === 'defaultValue') {
          this.defaultValueDf = this.defaultValue || [];
          const typeDF: any[] = (this.defaultValue || []).filter(x => !!x);
          this.setupDefault();
          if (!this.disableOutputDefault) {

            this.watchValues.emit({ value: typeDF.map(m => ({ _key: m?.code, value: m?.value })) });
          }

        }

        if (key === 'isResetInput') {
          if (this.isResetInput) {
            this.selectOne = {};
            this.optionSelected = [];
            this.inputControl.patchValue('');
            this.dataSource = AitAppUtils.deepCloneArray(this.dataSourceDf);
            this.filteredOptions$ = of(this.dataSourceDf);
            this.isResetInput = false;
          }
        }
      }
    }
  }

  setupDefault = () => {
    if (this.defaultValue && this.defaultValue.length !== 0) {

      if (this.MAXITEM !== 1) {
        const typeDF = AitAppUtils.getArrayNotFalsy(this.defaultValue);

        const findByKeys = typeDF.map((m) => {
          const result = this.dataSourceDf.find(
            (f) => f._key === m?._key || f.code === m?._key
          );
          return result;
        });
        this.optionSelected = [...AitAppUtils.getArrayNotFalsy(findByKeys)].filter(
          (f) => !!f
        );
        const _keys = this.optionSelected.map((m) => m?._key);

        this.dataSource = AitAppUtils.deepCloneArray(this.dataSourceDf).map((d) => {
          if (this.isResetInput) {
            return {
              ...d,
              isChecked: false,
            };
          }
          return {
            ...d,
            isChecked: _keys.includes(d._key) || _keys.includes(d.code),
          };
        });
        this.data = this.dataSource;

        if (!this.isClickOption && !this.isOpenAutocomplete) {
          this.filteredOptions$ = of(this.dataSource)
        }



      } else {

        const findByKey = this.dataSourceDf.find(
          (f) =>
            f._key === this.defaultValue[0]?._key ||
            f.code === this.defaultValue[0]?._key
        );
        this.selectOne = { _key: findByKey?.code, value: findByKey?.value };
        // console.log(this.defaultValue, this.dataSourceDf, this.selectOne)

        this.inputControl.setValue(this.selectOne?.value || '');
        this.getFilteredDataSource();
      }
    }
  };

  settingData = () => {
    const cond = {};
    if (this.parentCode) {
      cond['parent_code'] = this.parentCode;
    }
    if (this.code) {
      cond['code'] = this.code;
    }

    if (this.class) {
      this.usingGraphQL(cond).then();
    }

  };

  usingGraphQL = async (cond) => {
    const rest = await this.masterDataService.find({
      class: this.class,
      ...cond
    }, {
      _key: true, code: true, name: true
    })

    let dataMaster = [];
    const result = rest?.data
    if (result) {
      dataMaster = result;
    }
    const r = dataMaster.map(r => ({ code: r.code, value: r.name }));


    const dataFiltered = AitAppUtils.getUniqueArray((r || []), 'value');

    const data = [...dataFiltered].map((m) => {
      const idx = Date.now() + Math.floor(Math.random() * 100);
      if (typeof m === 'string') {
        return {
          name: m,
          isChecked: false,
          optionId: idx,
        };
      }
      return {
        ...m,
        isChecked: false,
        optionId: m._key ? m._key + idx : idx,
      };
    });

    const dataFilter = data.filter(d => d.value)

    this.dataSource = dataFilter;
    this.dataSourceDf = AitAppUtils.deepCloneArray(this.dataSource);

    this.setupDefault();
    if (this.maxItem !== 1) {
      this.inputControl.valueChanges.subscribe(value => {
        this.filteredOptions$ = of(this.dataSource);
      })
    }

  }

  get DATASUGGEST(): any[] {
    const keys = this.optionSelected.map(m => m?._key)
    const data = this.dataSource.filter(f => !keys.includes(f?._key));
    return [...this.optionSelected, ...data]
  }

  ngOnInit() {
    this.settingData();
  }

  convertToBoolean = (value) => {
    if (value) {
      return false;
    }
    return true;
  }

  handleClick = () => {
    if (this.maxItem !== 1) {

      if (!this.isOpenAutocomplete && !this.isClickOption) {
        this.filteredOptions$ = of(this.sortItems(this.dataSource))
      }
    }
  }


  getSelectedOptions = () =>
    this.dataSource
      .filter((f) => !!f.isChecked)
      .map((m) => ({ _key: m?.code, value: m?.value }));

  checkItem = (event: Event, opt: any) => {
    let target
    const itemFind = this.dataSource.find((f) => f.optionId === opt.optionId);
    if (this.optionSelected.length < this.MAXITEM) {

      itemFind.isChecked = !itemFind.isChecked;

      this.optionSelected = this.getSelectedOptions();
      target = this.dataSource;
      this.watchValues.emit({ value: this.optionSelected });
    } else {
      if (itemFind.isChecked) {
        itemFind.isChecked = !itemFind.isChecked;
        this.optionSelected = this.getSelectedOptions();

        this.watchValues.emit({ value: this.optionSelected });
      }
    }
    setTimeout(() => {
      this.dataSource = target;
      this.isClickOption = false;
    }, 10)

  };

  displayOptions = () => {
    const res2 = this.optionSelected.map((m) => m?.value || '');
    return this.optionSelected.length !== 0 ? res2.join(', ') : '';
  };

  getFilteredDataSource = () => {
    const result = AitAppUtils.deepCloneArray(this.dataSourceDf).filter(
      (f) => f.code === this.selectOne?._key || f._key === this.selectOne?.key
    );

    const _keys = result.map((m) => m?._key);
    const filteredResult = AitAppUtils.deepCloneArray(this.dataSourceDf).filter(
      (f) => !_keys.includes(f._key)
    );
    const excludeOptionNull = filteredResult.filter(f => f.value);
    const sortOptions = excludeOptionNull
    this.dataSource = sortOptions;
    this.data = sortOptions;
    this.filteredOptions$ = of(sortOptions);
  };

  sortItems = (array: any[]) => {
    return array.sort((x, y) => (x.isChecked === y.isChecked) ? 0 : x.isChecked ? -1 : 1);
  }

  get MAXITEM(): number {
    return this.maxItem ? this.maxItem : 99999999999;
  }


  optionClicked(event: Event, opt: any) {
    console.log(opt)
    this.isClickOption = true;
    this.checkItem(event, opt);
    this.inputControl.patchValue('');

    // event.stopPropagation();
  }

  disableClickCheckbox = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => { };
    event.checked = false;
    return false;
  };


  isSelectMatch = (value) => {
    const values = this.dataSourceDf.map(m => m?.value);
    if (this.maxItem === 1) {

      if (!values.includes(value)) {
        this.selectOne = {};
        this.inputControl.patchValue('');
      }
      else {
        this.inputControl.patchValue(this.selectOne?.value || '');

      }
    }
    else {

    }

    return values.includes(value);
  }



  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if (this.maxItem === 1) {
        this.data = this.dataSourceDf;
        this.filteredOptions$ = of(this.dataSourceDf);
      }


      if (this.isOpenAutocomplete) {
        if (!this.isClickOption) {
          this.hideAutocomplete();
        }
        else {
          this.openAutocomplete();
        }
      } else {
        this.openAutocomplete()
      }


    } else {
      if (!this.isClickOption) {
        this.outFocusValues.emit(true);
        this.hideAutocomplete();

      }
    }
  }


  onFocus = () => {
    this.isHideLabel = true;
  }


  outFocus = () => {
    this.isHideLabel = false;
    setTimeout(() => {
      const values = this.dataSourceDf.map(m => m?.value);
      if (this.maxItem === 1) {
        if (!values.includes(this.selectOne?.value)) {
          this.selectOne = {};
          this.watchValues.emit({
            value: [],
          });
          this.data = this.dataSourceDf;
          this.filteredOptions$ = of(this.dataSourceDf)
          this.onInput.emit({ value: '' })
        }
      }
    }, 100)
    this.outFocusValues.emit(true);
  }

  onTab = () => {
    if (this.maxItem === 1) {
      const values = this.dataSourceDf.find(f => f?.value === this.selectOne?.value);
      if (values) {
        this.watchValues.emit({
          value: [values],
        })
      }
      else {
        this.selectOne = {};
        this.watchValues.emit({
          value: [],
        });
        this.onInput.emit({ value: '' })
      }
    }

    this.hideAutocomplete();
  }



  handleInput = (value) => {
    this.openAutocomplete();
    this.onInputValues.emit({ value: [{ value }] });
    if (this.maxItem === 1) {
      const res = this._filter(value);
      this.data = res;
      this.filteredOptions$ = of(res);
      this.onInput.emit({ value });
      if (value === '') {
        this.selectOne = {};
        this.defaultValue = [];
        this.dataSource = AitAppUtils.deepCloneArray(this.dataSourceDf);
        this.filteredOptions$ = of(this.dataSource);
        this.watchValues.emit({ value: [] })
      } else {
        const text = value;
        this.selectOne = { value }

        this.data = this._filter(text)
        this.filteredOptions$ = of(this._filter(text));
      }
    }
    else {
      if (value === '') {
        this.defaultValue = [];
        this.filteredOptions$ = of(this.dataSource);
        this.watchValues.emit({ value: [] })
      } else {

        const text = value;
        this.data = this._filter(text)
        this.filteredOptions$ = of(this._filter(text));
      }
    }


  };

  onSelectionChange($event) {
    this.selectOne = { _key: $event?.code, value: $event?.value };
    this.inputControl.patchValue($event?.value || '')
    this.onInput.emit({ value: $event?.value })

    this.watchValues.emit({
      value: [{ _key: $event?.code, value: $event?.value }],
    });
    this.getFilteredDataSource();

  }

  getSelectedItems = (data: any[]) => {

    if (data.length === 1) {
      const statement = data[0]?.value;
      return statement;
    } else if (data.length !== 1) {
      const statements = data.map((m) => m?.value);

      const statement = statements[0];
      return statement + `（+${statements.length - 1} items）`;
    }
    return '';
  };

  private _filter(value: string): string[] {
    const filterValue = value?.toString().toLowerCase();
    const result = this.dataSourceDf.filter((f) => {

      const target = f?.value;

      return target.toString().toLowerCase().includes(filterValue);
    });
    return filterValue !== '' ? result : this.dataSource;
  }
}
