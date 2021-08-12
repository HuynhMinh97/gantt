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
import { AitAuthService, AitEnvironmentService, AitMasterDataService, AitTranslationService, AitUserService } from '../../services';
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
    private translateSerivce: AitTranslationService,
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
  DataSource: any[] = [];
  optionSelected: any[] = [];
  dataSourceDf = [];
  selectOne: any;
  isClickedIcon = false;
  defaultValueDf: any;
  data = [];
  currentValue = '';
  @Input() tabIndex;

  @Input() hideLabel = false;
  @ViewChild('autoInput', { static: false }) auto: ElementRef;
  @ViewChild('input') input: ElementRef;
  @ViewChild('inputContainer', { static: false }) inputContainer: ElementRef;

  @Input() class: string;
  @Input() parentCode: string;
  @Input() code: string;
  @Input()
  placeholder: string = '';
  @Input() maxItem: number = 1;
  @Input() icon: string = 'search-outline';
  @Input() widthInput: number = 400;
  @Input() defaultValue: any[] = [];
  @Input() style: any;
  @Input() styleInput: any;
  @Output() watchValue = new EventEmitter();
  @Output() onInput = new EventEmitter();
  @Output() onInputValues = new EventEmitter();
  @Output() outFocusValues = new EventEmitter();
  isDropDownList = false;
  @Input() isReadOnly = false;
  @Input() disableOutputDefault = false;
  @Input() isReset = false;
  @Input() isError = false;
  @Input() required = false;
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = 'info-outline';
  @Input() excludedValue: any[] = [];
  @Input() dataSource: any[];
  @Input() collection = 'sys_master_data';
  @Input() targetValue = 'name';
  @Input() classContainer;
  @Input() id = Date.now();
  @Input() styleLabel;
  @Input() width;
  @Input() height;
  @Input() isSubmit = false;
  @Input() allowNew = false;
  @Output() onError = new EventEmitter();
  dataFilter = [1];
  @Input() errorMessages;
  @Input() isResetInput;
  @Input() clearError = false;
  @Input()
  includeNotActive = true;
  @Input()
  includeNotDelete = true
  monitorLabel = true;
  @Output() onSendAllowText

  isFocusInput = false;

  isClickLabel = false;

  currentSortData = [];


  componentErrors = []

  isHideLabel = false;
  isClickOption = false;
  isClickIcon = false;
  isFocus = false;

  openAutocomplete = () => this.isOpenAutocomplete = true;
  hideAutocomplete = () => {
    this.isOpenAutocomplete = false;

  }

  ID(element: string): string {
    return this.id + '_' + element;
  }

  focusInput = () => {
    this.isFocus = true;
  }

  getFocus = () => {
    if (this.isError) {
      return false;
    }
    return this.isFocus || this.isOpenAutocomplete;
  }

  getCaptions = () => this.translateSerivce.translate(this.guidance);


  getFieldName = () => this.translateSerivce.translate(this.label);


  ngAfterViewChecked() {
    // your code to update the model
    this.cdr.detectChanges();
  }

  get PLACEHOLDER(): string {
    if (this.maxItem === 1) {
      if (this.selectOne?.value) {
        return '';
      }
      return this.translateSerivce.translate(this.placeholder) || '';
    }
    else if (this.maxItem !== 1) {
      return this.optionSelected.length < 1 ? this.translateSerivce.translate(this.placeholder) : '';
    }
    return '';
  }

  get VALUE(): string {
    if (!this.defaultValue) {
      return this.selectOne?.value || ''
    }
    if (this.maxItem === 1) {
      return this.selectOne?.value || ''
    }
    else {
      return '';
    }
  }

  compareDeep = (agr1: any, agr2: any) => JSON.stringify(agr1) === JSON.stringify(agr2);

  messagesError = () => Array.from(new Set([...this.componentErrors, ...(this.errorMessages || [])]))


  ngOnChanges(changes: SimpleChanges) {
    if (this.parentCode) {
      this.selectOne = {};
      this.settingData();
    }
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {

        if (key === 'allowNew') {
          console.log(this.allowNew)
        }

        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          }
          else {
            const check = this.maxItem === 1 ? !this.selectOne?.value : this.optionSelected.length === 0;

            if (this.required) {
              if (!check) {
                this.isError = false;
                this.onError.emit({ isValid: true });
              }
              else {
                this.onError.emit({ isValid: false });
              }
            }
            else {
              this.isError = false;
              this.onError.emit({ isValid: true });
            }


          }
        }

        if (key === 'isSubmit') {
          if (this.isSubmit) {
            this.checkReq();
          }
        }
        if (this.parentCode && key === 'parentCode') {
          this.settingData();
        }
        if (this.defaultValue && key === 'defaultValue') {
          this.defaultValueDf = this.defaultValue || [];
          // const typeDF: any[] = (this.defaultValue || []).filter(x => !!x);
          this.setupDefault();

        }

        if (key === 'isReset') {
          if (this.isReset) {
            this.selectOne = {};
            this.componentErrors = [];
            this.errorMessages = [];
            this.isError = false
            this.optionSelected = [];
            this.inputControl.patchValue('');
            this.DataSource = AitAppUtils.deepCloneArray(this.dataSourceDf);
            this.filteredOptions$ = of(this.dataSourceDf);
            this.onError.emit({ isValid: null });

            this.isReset = false;
          }
        }

        if (key === 'clearError') {
          if (this.clearError) {
            this.componentErrors = [];
            this.errorMessages = [];
            this.isError = false;
          }
        }
      }
    }
  }

  getAllowNewText = () => {
    if (this.allowNew) {
      return this.translateSerivce.translate('allow_new');
    }
    return '';
  };

  enter = () => {
    console.log(this.dataFilter.length === 0, this.allowNew)
    if (this.dataFilter.length === 0 && this.allowNew) {
      this.checkAllowNew(this.currentValue);
    }
  }

  //TODO Khi nhấn enter sẽ chọn lun giá trị đó nếu save thành công
  checkAllowNew = (value: string) => {
    console.log(value)
    // const title = this.translateSerivce.translate(
    //   'c_10020'
    // );
    // const successToSave = this.translateSerivce.getMsg('I0012')
    if (this.allowNew) {
      const find = this.dataSourceDf.find(d => d.value === value);
      if (!find) {
        this.masterDataService.saveData([{
          active_flag: true,
          class: this.class || '',
          code: value,
          name: {
            vi_VN: value,
            ja_JP: value,
            en_US: value
          },
        }]).then(r => {
          if (r?.status === RESULT_STATUS.OK) {
            const func = () => {
              if (this.maxItem !== 1) {

                const d = r?.data[0];
                this.checkItem(null, { code: d?.code, value: d.name });
                this.currentValue = '';


                this.inputControl.setValue(null);
                this.input.nativeElement.value = '';
                if (this.dataFilter.length === 0) {
                  this.dataFilter = [1];
                }
                this.hideAutocomplete();
                this.DataSource = this.sortItems(this.DataSource);
                this.filteredOptions$ = of(this.sortItems(this.DataSource));
                setTimeout(() => {
                  this.openAutocomplete()
                }, 150)
              }
              else {
                this.inputControl.setValue(null);
                this.inputControl.patchValue(this.currentValue);
                this.handleInput(this.currentValue);
                const d = r?.data[0];
                this.onSelectionChange({ code: d?.code, value: d.name });
                this.hideAutocomplete();
                this.selectOne = { _key: d?.code, value: d.name };
                if (this.dataFilter.length === 0) {
                  this.dataFilter = [1];
                }
                this.checkReq();
                this.input.nativeElement.blur();

              }
            }
            this.settingData(func);


          }
          else {
          }
        })
      }
    }

  }

  setupDefault = () => {
    if (this.defaultValue && this.defaultValue.length !== 0) {

      if (this.MAXITEM !== 1) {
        const typeDF = this.getUniqueSelection(AitAppUtils.getArrayNotFalsy(this.defaultValue));
        const findByKeys = typeDF.map((m) => {
          const result = this.dataSourceDf.find(
            (f) => f._key === m?._key || f.code === m?._key
          );
          return result;
        });
        this.optionSelected = [...AitAppUtils.getArrayNotFalsy(findByKeys)].filter(
          (f) => !!f
        )

        if (!this.disableOutputDefault) {

          this.watchValue.emit({ value: this.optionSelected.map(m => ({ _key: m?.code, value: m?.value })) });
        }


        const _keys = this.optionSelected.map((m) => m?.code);

        this.DataSource = AitAppUtils.deepCloneArray(this.dataSourceDf).map((d) => {
          if (this.isReset) {
            return {
              ...d,
              isChecked: false,
            };
          }
          return {
            ...d,
            isChecked: _keys.includes(d.code),
          };
        });

        this.data = this.DataSource;

        if (!this.isClickOption && !this.isOpenAutocomplete) {
          this.filteredOptions$ = of(this.DataSource)
        }



      } else {

        const findByKey = this.dataSourceDf.find(
          (f) =>
            f._key === this.defaultValue[0]?._key ||
            f.code === this.defaultValue[0]?._key
        );
        this.selectOne = { _key: findByKey?.code, value: findByKey?.value };
        if (!this.disableOutputDefault) {
          const res = this.selectOne?._key ? [this.selectOne] : []
          this.watchValue.emit({ value: res });
        }

        this.inputControl.setValue(this.selectOne?.value || '');
        this.getFilteredDataSource();
      }
    }
  };

  settingData = (cb?: any) => {
    const cond = {};
    if (this.parentCode) {
      cond['parent_code'] = this.parentCode;
    }
    if (this.code) {
      cond['code'] = this.code;
    }

    if (this.class && this.collection === 'sys_master_data') {
      this.usingGraphQL(cond).then(() => {
        if (cb) {
          cb();
        }
      });
    }
    else {
      this.usingGraphQL({}, false).then(() => {
        if (cb) {
          cb();
        }
      });
    }

  };

  usingGraphQL = async (cond, hasClass = true) => {
    let dataMaster = [];
    if (this.dataSource) {
      dataMaster = this.dataSource;
    }
    else {
      const condition = {
        ...cond
      };
      if (hasClass) {
        condition.class = {
          value: [this.class]
        }
      }
      const rest = await this.masterDataService.find({
        ...condition
      }, {
        _key: true, code: true, [this.targetValue]: true,
      }, this.collection, this.includeNotDelete, this.includeNotActive);


      const result = rest?.data
      if (result) {
        dataMaster = result || [];
      }
    }
    const r = dataMaster.map(r => ({ code: r.code || r._key, value: r[this.targetValue] || r?.value, _key: r.code || r._key }));



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

    const dataFilter = data.filter(d => d.value);
    let ret = dataFilter;
    const _keys = this.excludedValue.map(e => e?._key);
    if (_keys.length !== 0) {
      ret = dataFilter.filter(f => !_keys.includes(f?._key));
    }



    this.DataSource = ret;
    this.dataSourceDf = AitAppUtils.deepCloneArray(this.DataSource);

    this.setupDefault();
    if (this.maxItem !== 1) {
      this.inputControl.valueChanges.subscribe(value => {
        // this.filteredOptions$ = of(this.DataSource);
      })
    }

  }

  get DATASUGGEST(): any[] {
    const keys = this.optionSelected.map(m => m?._key)
    const data = this.DataSource.filter(f => !keys.includes(f?._key));
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

  getSortedDataSource = () => {
    return this.sortItems(this.DataSource);
  }

  handleClickInput = () => {
    this.isOpenAutocomplete = false;
    // this.dataFilter = [];
    setTimeout(() => {
      //   if (!this.isClickOption) {
      //     // this.isHideLabel = true;
      //     this.dataFilter = [1];
      // this.filteredOptions$ = of(this.DataSource);
      this.isOpenAutocomplete = true;
      // }
    }, 50)

  }

  handleClick = (isClickInput = false) => {

    this.isClickLabel = true;
    // this.filteredOptions$ = of([]);
    if (this.maxItem !== 1) {

      //
      if (!this.isOpenAutocomplete && !this.isClickOption) {
        // this.isClickLabel = true;
        setTimeout(() => {


          const dataSort = this.getSortedDataSource();
          this.dataFilter = [1];
          this.filteredOptions$ = of(dataSort);


          this.isHideLabel = true;


        }, 0)


      }
    }
    else {
      // this.input.nativeElement.focus();
    }


    //
    // this.isHideLabel = true;
  }


  getSelectedOptions = () =>
    AitAppUtils.deepCloneArray(this.DataSource)
      .filter((f) => !!f.isChecked)
      .map((m) => ({ _key: m?.code, value: m?.value }));

  checkItem = (event: Event, opt: any) => {

    let target;
    let targetId;

    const itemFind = this.DataSource.find((f) => f?.optionId === opt?.optionId || f?._key === opt?.code);
    if (this.optionSelected.length < this.MAXITEM) {
      itemFind.isChecked = !itemFind.isChecked;

      this.optionSelected = this.getSelectedOptions();
      target = this.DataSource;
      this.filteredOptions$ = of(this.DataSource);
      this.watchValue.emit({ value: this.optionSelected.map(m => ({ _key: m?._key, value: m?.value })) });
    } else {
      if (itemFind.isChecked) {
        itemFind.isChecked = !itemFind.isChecked;
        this.optionSelected = this.getSelectedOptions();
        target = this.DataSource;
        this.filteredOptions$ = of(this.DataSource);
        this.watchValue.emit({ value: this.optionSelected.map(m => ({ _key: m?._key, value: m?.value })) });
      }
    }


    if (this.required) {
      if (this.optionSelected.length === 0) {
        const err = this.translateSerivce.getMsg('E0001').replace('{0}', this.getFieldName());
        this.componentErrors = [err]
        this.onError.emit({ isValid: false });
      }
      else {
        this.onError.emit({ isValid: true });

      }
    }
    setTimeout(() => {
      if (target) {
        this.DataSource = target
        // this.filteredOptions$ = of(this.DataSource);

        this.currentSortData = AitAppUtils.deepCloneArray(target);
        this.isHideLabel = false;
        this.isClickOption = false;
      }
    }, 10)
  };

  displayOptions = () => {
    const target = Array.from(new Set(this.optionSelected.map(m => m.value)));
    const res2 = target.map((m) => m || '');
    return target.length !== 0 ? res2.join(', ') : '';
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
    this.DataSource = sortOptions;
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
    this.isClickOption = true;
    this.isHideLabel = false;
    this.isClickLabel = false;
    this.clearErrors();

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
    const values = this.dataSourceDf.find(m => m.value === value);
    if (this.maxItem === 1) {

      if (!values) {
        this.selectOne = {};
        this.inputControl.patchValue('');
        this.watchValue.emit({ value: [] })

      }
      else {
        this.selectOne = { _key: values?.code, value: values?.value };
        this.inputControl.patchValue(this.selectOne?.value || '');
        this.watchValue.emit({ value: [this.selectOne] })


      }
    }
    else {

    }

    return !!values;
  }

  getUniqueSelection = (arr: any[]) => {
    const res = [];
    const target = [];
    arr.forEach(item => {
      if (!res.includes(item?.value)) {
        res.push(item?.value)
        target.push(item)
      }
    })
    return AitAppUtils.getArrayNotFalsy(target);
  }



  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.isReadOnly) {
      if (this.inputContainer?.nativeElement.contains(event.target)) {
        if (this.maxItem === 1) {
          this.data = this.dataSourceDf;
          this.filteredOptions$ = of(this.dataSourceDf);
        }
        else {
          this.isHideLabel = true;
          if (!this.isOpenAutocomplete && !this.isClickOption && !this.isFocusInput) {
            // alert('#in')

            this.filteredOptions$ = of(this.sortItems(this.DataSource));
            this.DataSource = this.sortItems(this.DataSource);
            this.input.nativeElement.focus();
          }


        }


        setTimeout(() => {
          if (this.isOpenAutocomplete) {
            if (!this.isClickOption && this.isClickIcon) {
              this.hideAutocomplete();
            }
            else {
              this.openAutocomplete();
            }
          } else {
            this.openAutocomplete()
          }
        }, 20)


      } else {
        this.isHideLabel = false;
        this.isClickLabel = false;
        if (!this.isClickOption) {
          this.outFocusValues.emit(true);
          this.hideAutocomplete();


        }
      }
    }
  }


  onFocus = (e) => {
    this.isHideLabel = true;
    this.isFocusInput = true;
    this.isOpenAutocomplete = false;
    setTimeout(() => {
      this.dataFilter = [1];
      // this.filteredOptions$ = of(this.DataSource);
      this.isOpenAutocomplete = true;
      this.isFocusInput = false;
    }, 10)
  }


  blur = (value) => {
    const values = this.dataSourceDf.find(m => m?.value === value);

    return !!values
  }

  outFocus = () => {

    this.isHideLabel = false;
    setTimeout(() => {
      if (this.maxItem === 1) {
        const values = this.dataSourceDf.find(m => m?.value === this.selectOne?.value);

        if (!values) {
          this.selectOne = {};
          this.watchValue.emit({
            value: [],
          });
          this.dataFilter = [1];
          this.data = this.dataSourceDf;
          this.filteredOptions$ = of(this.dataSourceDf)

          this.onInput.emit({ value: '' })
        }
        else {
          this.inputControl.patchValue(this.selectOne?.value || '')
        }
      }
      else {
        const values = AitAppUtils.deepCloneArray(this.dataSourceDf).find(m => m?.value === this.inputControl.value);
        if (!values) {
          // this.watchValue.emit({
          //   value: this.optionSelected.map(x => ({ _key: x?._key, value: x?.value })),
          // });
          this.inputControl.setValue(null)
          // this.dataFilter = [1];
          // this.filteredOptions$ = of (this.sortItems(this.DataSource))

          this.onInput.emit({ value: '' })
        }

      }
      this.checkReq();
      this.isHideLabel = false;
    }, 120)
    this.outFocusValues.emit(true);

  }

  checkReq = () => {

    if (this.required) {
      const check = this.maxItem === 1 ? !this.selectOne?.value : this.optionSelected.length === 0;
      if (check) {
        const err = this.translateSerivce.getMsg('E0001').replace('{0}', this.getFieldName());
        this.isError = true;
        this.componentErrors = [err]
        this.onError.emit({ isValid: false });

      }
      else {
        this.onError.emit({ isValid: true });
        this.clearErrors();
        this.isError = false;
      }
    }
    else {
      this.clearErrors();
      this.isError = false;
    }
  }

  onTab = () => {
    if (this.maxItem === 1) {
      const values = this.dataSourceDf.find(f => f?.value === this.selectOne?.value);
      if (values) {
        this.watchValue.emit({
          value: [{ _key: values?._key, value: values?.value }],
        })
      }
      else {
        this.selectOne = {};
        this.watchValue.emit({
          value: [],
        });
        this.onInput.emit({ value: '' })
      }
    }

    this.hideAutocomplete();
  }


  clearErrors = () => {
    this.componentErrors = [];
    this.errorMessages = [];
    this.isError = false;
  }

  handleClickIcon = () => {
    if (this.isOpenAutocomplete) {
      this.isClickedIcon = true;
      this.dataFilter = [];
      this.isOpenAutocomplete = false;
      setTimeout(() => {
        this.isHideLabel = false;
      }, 50)
    }

  }

  handleInput = (value) => {
    this.isHideLabel = true;
    this.currentValue = value;
    this.clearErrors();
    if (this.maxItem === 1) {
      this.onInput.emit({ value });
      if (value === '') {
        this.selectOne = {};
        this.filteredOptions$ = of(this.dataSourceDf);
        this.watchValue.emit({ value: [] })
      } else {
        const text = value;
        this.selectOne = { value }

        this.data = this._filter(text)
        this.filteredOptions$ = of(this._filter(text));
      }
    }
    else {

      if (value === '') {
        this.watchValue.emit({ value: this.optionSelected.map(x => ({ _key: x?._key, value: x?.value })) });
        setTimeout(() => {
          // this.DataSource = this.sortItems(this.DataSource);
          this.dataFilter = [1];
          this.filteredOptions$ = of(this.sortItems(this.DataSource));
        }, 400)


      } else {
        this.dataFilter = [1];
        const text = value;
        this.data = this._filter(text);
        // this.DataSource = this._filter(text);
        this.filteredOptions$ = of(this._filter(text));
      }
    }

    if (this.required) {
      if (value === '' && this.optionSelected.length === 0) {

        const err = this.translateSerivce.getMsg('E0001').replace('{0}', this.getFieldName());
        this.isError = true;
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });

      }
      else {
        this.onError.emit({ isValid: true });

      }
    }
    this.openAutocomplete();
    this.onInputValues.emit({ value: [{ value }] });





  };

  onSelectionChange($event) {
    this.clearErrors();
    this.selectOne = { _key: $event?.code, value: $event?.value };
    this.inputControl.patchValue($event?.value || '')
    this.onInput.emit({ value: $event?.value })

    this.watchValue.emit({
      value: [{ _key: $event?.code, value: $event?.value }],
    });
    this.getFilteredDataSource();

    if (this.required) {
      if (!this.selectOne?.value) {
        this.isError = true;
        const err = this.translateSerivce.getMsg('E0001').replace('{0}', this.getFieldName());
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });

      }
      else {
        this.onError.emit({ isValid: true });

      }
    }

  }

  getStringByLength = (a: string[], count = 0) => {
    const i = count;
    if ((a[i] || '').length > 6) {
      return this.getStringByLength(a, i + 1);
    }
    return a[i];
  }

  getSelectedItems = (data: any[]) => {
    const itemsText = this.translateSerivce.translate('アイテム');
    const target = Array.from(new Set(data.map((m) => m?.value)));
    if ((target || []).length === 1) {
      const statement = target[0];
      return statement;
    } else if ((target || []).length !== 1) {

      const statement = this.getStringByLength(target);
      return statement + `（+${target.length - 1} ${itemsText})`;
    }
    return '';
  };

  private _filter(value: string): string[] {
    const filterValue = value?.toString().toLowerCase();
    const result = this.DataSource.filter((f) => {

      const target = f?.value;

      return target.toString().toLowerCase().includes(filterValue);
    });
    this.dataFilter = filterValue !== '' ? result : this.DataSource;
    return filterValue !== '' ? result : this.DataSource;
  }
}
