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
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import {
  AitAuthService,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AitUserService,
} from '../../services';
import { AppState } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';
import { AitBaseComponent } from '../base.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ait-autocomplete-master-data',
  styleUrls: ['./ait-autocomplete-master-data.component.scss'],
  templateUrl: './ait-autocomplete-master-data.component.html',
})
export class AitAutoCompleteMasterDataComponent
  extends AitBaseComponent
  implements OnInit, AfterViewChecked, OnChanges {
  inputControl: FormControl;
  currentLang = 'en_US';
  currentCompany = '';
  @Input() isShow = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private masterDataService: AitMasterDataService,
    store: Store<AppState>,
    authService: AitAuthService,
    userService: AitUserService,
    _envService: AitEnvironmentService,
    private translateSerivce: AitTranslationService,
    apollo: Apollo,
    toastrService: NbToastrService
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      _envService,
      null,
      toastrService
    );
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.inputControl = new FormControl({
      value: '',
      disabled: this.isReadOnly,
    });
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
  isCancle = false;
  @Input() tabIndex;

  @Input() hideLabel = false;
  @ViewChild('autoInput', { static: false }) auto: ElementRef;
  @ViewChild('input') input: ElementRef;
  @ViewChild('inputContainer', { static: false }) inputContainer: ElementRef;

  @Input() class: string;
  @Input() parentCode: string;
  @Input() parentCodeExternal: string;
  @Input() code: string;
  @Input() sortBy: string;
  @Input() allowDelete = false;
  @Input()
  placeholder: string = '';
  @Input() maxItem: number = 9999999 * 100;
  @Input() icon: string = 'search-outline';
  @Input() widthInput: number = 400;
  @Input() defaultValue: any[] = [];
  @Input() style: any;
  @Input() styleInput: any;
  @Output() watchValue = new EventEmitter();
  @Output() onInput = new EventEmitter();
  @Output() onInputValues = new EventEmitter();
  @Output() outFocusValues = new EventEmitter();
  @Output() onDragDrop = new EventEmitter();
  isDropDownList = false;
  @Input() isReadOnly = false;
  @Input() disableOutputDefault = false;
  @Input() isReset = false;
  @Input() isError = false;
  @Input() required = false;
  @Input() label;
  @Input() guidance = '';
  @Input() guidanceIcon = 'info-outline';
  @Input() excludedValue: any[] = [];
  @Input() dataSource: any[];
  @Input() collection = 'sys_master_data';
  @Input() targetValue = 'name';
  @Input() classContainer;
  @Input() id;
  @Input() styleLabel;
  @Input() width = '450px';
  @Input() height;
  @Input() isSubmit = false;
  @Input() allowNew = false;
  @Input() allowDragDrop = false;
  @Input() allowCheckAll = false;
  @Output() onError = new EventEmitter();
  dataFilter = [1];
  @Input() errorMessages;
  @Input() isResetInput;
  @Input() clearError = false;
  @Input()
  includeNotActive = true;
  @Input()
  includeNotDelete = true;
  monitorLabel = true;
  @Output() onSendAllowText;

  lastSortNo = 0;

  isFocusInput = false;

  isClickLabel = false;

  currentSortData = [];

  componentErrors = [];

  isHideLabel = false;
  isClickOption = false;
  isClickIcon = false;
  isFocus = false;

  openAutocomplete = () => (this.isOpenAutocomplete = true);
  hideAutocomplete = () => {
    this.isOpenAutocomplete = false;
  };

  getCancelStatus = () => {
    if (this.inputControl?.value || this.optionSelected.length !== 0) {
      return true;
    }
    return false;
  };

  cancelResult() {
    setTimeout(() => {
      this.selectOne = {};
      this.optionSelected = [];
      this.DataSource = AitAppUtils.deepCloneArray(this.dataSourceDf);
      this.filteredOptions$ = of(AitAppUtils.deepCloneArray(this.dataSourceDf));
    }, 100);
    this.watchValue.emit({
      value: [],
    });
    this.inputControl.reset();
  }

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  focusInput = () => {
    this.isFocus = true;
  };

  getFocus = () => {
    if (this.isError) {
      return false;
    }
    return this.isFocus || this.isOpenAutocomplete;
  };

  getCaptions = () => this.translateSerivce.translate(this.guidance);

  getFieldName = () => this.translateSerivce.translate(this.label);

  getPlaceHolder = () => this.translateSerivce.translate(this.placeholder);

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
    } else if (this.maxItem !== 1) {
      return this.optionSelected.length < 1
        ? this.translateSerivce.translate(this.placeholder)
        : '';
    }
    return '';
  }

  get VALUE(): string {
    if (!this.defaultValue) {
      return this.selectOne?.value || '';
    }
    if (this.maxItem === 1) {
      return this.selectOne?.value || '';
    } else {
      return '';
    }
  }

  compareDeep = (agr1: any, agr2: any) =>
    JSON.stringify(agr1) === JSON.stringify(agr2);

  messagesError = () => {
    const errors = new Set([
      ...this.componentErrors,
      ...(this.errorMessages || []),
    ]);
    return Array.from(errors).filter(
      (error: string) => error.indexOf('undefined') === -1
    );
  };

  handleRemove = (option: any) => {
    this.masterDataService
      .deleteDataEachItem({ _key: option?.id })
      .then((res) => {
        if (res) {
          this.DataSource = this.DataSource.filter(
            (f) => f._key !== option._key
          );
          this.dataSourceDf = this.dataSourceDf.filter(
            (f) => f._key !== option._key
          );

          if (this.maxItem === 1) {
            if (this.selectOne?._key === option?._key) {
              this.selectOne = {};
              this.watchValue.emit({ value: [] });
            }
          } else {
            this.optionSelected = this.optionSelected.filter(
              (f) => f._key !== option?._key
            );
            this.watchValue.emit({
              value: this.optionSelected.map((s) => ({
                _key: s?._key,
                value: s?.value,
              })),
            });
          }

          setTimeout(() => {
            if (this.errorMessages?.length === 0) {
              this.isError = false;
              this.componentErrors = [];
            } else {
              this.componentErrors = [];
            }
          }, 150);
          this.filteredOptions$ = of(this.DataSource);
        }
      });
  };

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          } else {
            const check =
              this.maxItem === 1
                ? !this.selectOne?.value
                : this.optionSelected.length === 0;

            if (this.required) {
              if (!check) {
                this.isError = false;
                this.onError.emit({ isValid: true });
              } else {
                this.onError.emit({ isValid: false });
              }
            } else {
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
        if (this.parentCodeExternal && key === 'parentCodeExternal') {
          this.settingData();
        }
        if (this.defaultValue && key === 'defaultValue') {
          this.defaultValueDf = this.defaultValue || [];
          setTimeout(() => {
            this.setupDefault();
          }, 100);
        }

        if (key === 'isReset') {
          if (this.isReset) {
            this.selectOne = {};
            this.componentErrors = [];
            this.errorMessages = [];
            this.isError = false;
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

        if (key === 'dataSource' && this.dataSource) {
          const dataMaster = this.dataSource;
          const r = (dataMaster || []).map((r) => ({
            code: r._key || r._key,
            value: r[this.targetValue] || r?.value,
            _key: r._key || r._key,
            id: r?._key,
          }));

          this.setupNew(r, dataMaster);
        }
      }
    }
  }

  setupNew(r: any[], dataMaster: any[]) {
    if (this.MAXITEM > 1 && this.allowCheckAll) {
      const all = {
        code: 'all',
        id: 'all',
        value: 'Check All',
        _key: 'all',
      };
      r.unshift(all);
    }

    const sortNoArr = dataMaster.map((x) => x?.sort_no).filter((s) => !!s);
    this.lastSortNo =
      sortNoArr.length !== 0
        ? Math.max.apply(null, sortNoArr)
        : dataMaster.length;

    const dataFiltered = AitAppUtils.getUniqueArray(r || [], 'value');

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

    const dataFilter = data.filter((d) => d.value);
    let ret = dataFilter;
    const _keys = this.excludedValue.map((e) => e?._key);
    if (_keys.length !== 0) {
      ret = dataFilter.filter((f) => !_keys.includes(f?._key));
    }

    this.DataSource = ret;
    this.dataSourceDf = AitAppUtils.deepCloneArray(this.DataSource);

    this.setupDefault();
  }

  getAllowNewText = () => {
    if (this.allowNew) {
      return this.translateSerivce.translate('allow_new');
    }
    return '';
  };

  enter = (event) => {
    event.preventDefault();
    if (this.dataFilter.length === 0 && this.allowNew) {
      this.checkAllowNew(this.currentValue);
    }
  };

  modifileOption = (value: string, count = 5) => {
    const width = this.width ? +this.width.replace('px', '') : 250;
    if (value?.length > width / 8.5) {
      return value.substring(0, width / 8 - count) + '...';
    }
    return value;
  };

  //TODO Khi nh???n enter s??? ch???n lun gi?? tr??? ???? n???u save th??nh c??ng
  checkAllowNew = (value: string) => {
    if (this.allowNew) {
      const find = this.dataSourceDf.find((d) => d.value === value);
      const dataReq: any = {
        code: value,
        name: {
          vi_VN: value,
          ja_JP: value,
          en_US: value,
        },
        sort_no: this.lastSortNo + 1,
        active_flag: true,
      };
      if (this.class && this.collection === 'sys_master_data') {
        dataReq.class = this.class || '';
      }
      if (!find) {
        this.masterDataService
          .saveData([dataReq], this.collection)
          .then((r) => {
            if (r?.status === RESULT_STATUS.OK) {
              const func = () => {
                if (this.maxItem !== 1) {
                  const d = r?.data[0];
                  this.checkItem(null, { code: d?._key, value: d.name });
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
                    this.openAutocomplete();
                  }, 150);
                } else {
                  this.inputControl.setValue(null);
                  this.inputControl.patchValue(
                    this.modifileOption(this.currentValue)
                  );
                  this.handleInput(this.currentValue);
                  const d = r?.data[0];
                  this.onSelectionChange({ code: d?._key, value: d.name });
                  this.hideAutocomplete();
                  this.selectOne = { _key: d?._key, value: d.name };
                  if (this.dataFilter.length === 0) {
                    this.dataFilter = [1];
                  }
                  this.checkReq();
                  this.input.nativeElement.blur();
                }
              };
              this.settingData(func);
            } else {
            }
          });
      }
    }
  };

  setupDefault = () => {
    if (this.defaultValue && this.defaultValue.length !== 0) {
      if (this.MAXITEM !== 1) {
        const typeDF = this.getUniqueSelection(
          AitAppUtils.getArrayNotFalsy(this.defaultValue)
        );

        const findByKeys = typeDF.map((m) => {
          const result = this.dataSourceDf.find(
            (f) => f._key === m?._key || f._key === m?._key || f?.id === m?._key
          );
          return result;
        });
        this.optionSelected = [
          ...AitAppUtils.getArrayNotFalsy(findByKeys),
        ].filter((f) => !!f);

        if (!this.disableOutputDefault) {
          this.watchValue.emit({
            value: this.optionSelected.map((m) => ({
              _key: m?._key,
              value: m?.value,
            })),
          });
        }

        const _keys = this.optionSelected.map((m) => m?._key);

        this.DataSource = AitAppUtils.deepCloneArray(this.dataSourceDf).map(
          (d) => {
            if (this.isReset) {
              return {
                ...d,
                isChecked: false,
              };
            }
            return {
              ...d,
              isChecked: _keys.includes(d._key),
            };
          }
        );

        this.data = this.DataSource;

        if (!this.isClickOption && !this.isOpenAutocomplete) {
          this.filteredOptions$ = of(this.DataSource);
        }
      } else {
        const findByKey = this.dataSourceDf.find((f) => {
          if (typeof this.defaultValue[0] === 'string') {
            return f._key === this.defaultValue[0];
          } else if (this.defaultValue[0]?._key) {
            return (
              f._key === this.defaultValue[0]?._key ||
              f.code === this.defaultValue[0]?._key
            );
          } else {
            return (
              f._key === this.defaultValue[0]?.value[0]?._key ||
              f.code === this.defaultValue[0]?.value[0]?._key
            );
          }
        });
        this.selectOne = { _key: findByKey?._key, value: findByKey?.value };
        if (!this.disableOutputDefault) {
          const res = this.selectOne?._key ? [this.selectOne] : [];
          this.watchValue.emit({ value: res });
        }

        this.inputControl.setValue(
          this.modifileOption(this.selectOne?.value) || ''
        );
        this.getFilteredDataSource();
      }
    }
  };

  settingData = (cb?: any) => {
    const cond = {};
    const options = {};
    if (this.parentCode) {
      cond['parent_code'] = this.parentCode;
    }
    if (this.parentCodeExternal) {
      cond['parent_code_external'] = this.parentCodeExternal;
    }
    if (this.code) {
      cond['code'] = this.code;
    }
    if (this.sortBy) {
      options['sort_by'] = { value: this.sortBy };
    }

    if (this.class && this.collection === 'sys_master_data') {
      this.usingGraphQL(cond, options).then(() => {
        if (cb) {
          cb();
        }
      });
    } else {
      this.usingGraphQL({}, options, false).then(() => {
        if (cb) {
          cb();
        }
      });
    }
  };

  usingGraphQL = async (cond, option, hasClass = true) => {
    let dataMaster = [];
    if (this.dataSource) {
      dataMaster = this.dataSource;
    } else {
      const condition = {
        ...cond,
      };
      const options = {
        ...option,
      };
      if (hasClass) {
        condition.class = {
          value: [this.class],
        };
      }
      const rest = await this.masterDataService.find(
        {
          ...condition,
        },
        {
          _key: true,
          code: true,
          [this.targetValue]: true,
          sort_no: true,
        },
        this.collection,
        options,
        this.includeNotDelete,
        this.includeNotActive
      );

      const result = rest?.data;
      if (result) {
        dataMaster = result || [];
      }
    }

    const r = dataMaster.map((r) => ({
      code: r._key || r.code,
      value: r[this.targetValue] || r?.value,
      _key: r._key || r.code,
      id: r?._key,
    }));

    this.setupNew(r, dataMaster);
  };

  get DATASUGGEST(): any[] {
    const keys = this.optionSelected.map((m) => m?._key);
    const data = this.DataSource.filter((f) => !keys.includes(f?._key));
    return [...this.optionSelected, ...data];
  }

  ngOnInit() {
    this.settingData();
  }

  convertToBoolean = (value) => {
    if (value) {
      return false;
    }
    return true;
  };

  getSortedDataSource = () => {
    return this.sortItems(this.DataSource);
  };

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
    }, 50);
  };

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
        }, 0);
      }
    } else {
      // this.input.nativeElement.focus();
    }

    //
    // this.isHideLabel = true;
  };

  getSelectedOptions = () =>
    AitAppUtils.deepCloneArray(this.DataSource)
      .filter((f) => !!f.isChecked)
      .map((m) => ({ _key: m?._key, value: m?.value }));

  checkItem = (event: Event, opt: any) => {
    let target;
    const itemFind = this.DataSource.find(
      (f) => f?.optionId === opt?.optionId || f?._key === opt?._key
    );
    if (this.optionSelected.length < this.MAXITEM) {
      itemFind.isChecked = !itemFind.isChecked;
      if (this.allowCheckAll) {
        if (opt._key === 'all') {
          this.DataSource.map((e) => (e.isChecked = opt.isChecked));
        } else if (!opt.isChecked) {
          this.DataSource[0].isChecked = opt.isChecked;
        } else {
          const isCheckAll = this.DataSource.every((e, i) => {
            if (i === 0) {
              return true;
            } else {
              return e.isChecked;
            }
          });
          if (isCheckAll) {
            this.DataSource[0].isChecked = true;
          }
        }
      }
      this.optionSelected = this.getSelectedOptions();
      target = this.DataSource;
      this.filteredOptions$ = of(this.DataSource);
      const dataReturn =
        this.allowCheckAll && (this.DataSource || [])[0]?.isChecked
          ? (this.optionSelected || []).slice(1)
          : this.optionSelected;
      this.watchValue.emit({
        value: (dataReturn || []).map((m) => ({
          _key: m?._key,
          value: m?.value,
        })),
      });
      setTimeout(() => {
        if (target) {
          this.DataSource = target;
          this.currentSortData = AitAppUtils.deepCloneArray(target);
          this.isHideLabel = false;
          this.isClickOption = false;
        }
      }, 10);
    } else {
      if (itemFind.isChecked) {
        itemFind.isChecked = !itemFind.isChecked;
        this.optionSelected = this.getSelectedOptions();
        target = this.DataSource;
        this.filteredOptions$ = of(this.DataSource);
        this.watchValue.emit({
          value: this.optionSelected.map((m) => ({
            _key: m?._key,
            value: m?.value,
          })),
        });
        setTimeout(() => {
          if (target) {
            this.DataSource = target;
            // this.filteredOptions$ = of(this.DataSource);

            this.currentSortData = AitAppUtils.deepCloneArray(target);
            this.isHideLabel = false;
            this.isClickOption = false;
          }
        }, 10);
      } else {
        this.dataFilter = [];
        setTimeout(() => {
          this.dataFilter = [1];
          this.isHideLabel = false;
          this.isClickOption = false;
        }, 10);
      }
    }

    if (this.required) {
      if (this.optionSelected.length === 0) {
        const err = this.translateSerivce
          .getMsg('E0001')
          .replace('{0}', this.getFieldName());
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });
      } else {
        this.onError.emit({ isValid: true });
      }
    }
  };

  displayOptions = () => {
    const target = Array.from(new Set(this.optionSelected.map((m) => m.value)));
    const res2 = target.map((m) => m || '');
    return target.length !== 0 ? res2.join(', ') : '';
  };

  getFilteredDataSource = () => {
    const result = AitAppUtils.deepCloneArray(this.dataSourceDf).filter(
      (f) => f._key === this.selectOne?._key || f._key === this.selectOne?.key
    );

    const _keys = result.map((m) => m?._key);
    const filteredResult = AitAppUtils.deepCloneArray(this.dataSourceDf).filter(
      (f) => !_keys.includes(f._key)
    );
    const excludeOptionNull = filteredResult.filter((f) => f.value);
    const sortOptions = excludeOptionNull;
    this.DataSource = sortOptions;
    this.data = sortOptions;
    this.filteredOptions$ = of(sortOptions);
  };

  sortItems = (array: any[]) => {
    return this.allowDragDrop
      ? array
      : array.sort((x, y) =>
          x.isChecked === y.isChecked ? 0 : x.isChecked ? -1 : 1
        );
  };

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
    console.error = () => {};
    event.checked = false;
    return false;
  };

  isSelectMatch = (value) => {
    const values = this.dataSourceDf.find((m) => m.value === value);
    if (this.maxItem === 1) {
      if (!values) {
        this.selectOne = {};
        this.inputControl.patchValue('');
        this.watchValue.emit({ value: [] });
      } else {
        this.selectOne = { _key: values?._key, value: values?.value };
        this.inputControl.patchValue(
          this.modifileOption(this.selectOne?.value) || ''
        );
        this.watchValue.emit({ value: [this.selectOne] });
      }
    } else {
    }

    return !!values;
  };

  getUniqueSelection = (arr: any[]) => {
    const res = [];
    const target = [];
    arr.forEach((item) => {
      if (!res.includes(item?._key)) {
        res.push(item?._key);
        target.push(item);
      }
    });
    return AitAppUtils.getArrayNotFalsy(target);
  };

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.isReadOnly) {
      if (this.inputContainer?.nativeElement.contains(event.target)) {
        if (this.maxItem === 1) {
          this.data = this.dataSourceDf;
          this.filteredOptions$ = of(this.dataSourceDf);
        } else {
          this.isHideLabel = true;
          if (
            !this.isOpenAutocomplete &&
            !this.isClickOption &&
            !this.isFocusInput
          ) {
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
            } else {
              this.openAutocomplete();
            }
          } else {
            this.openAutocomplete();
          }
        }, 60);
      } else {
        this.isHideLabel = false;
        this.isClickLabel = false;
        if (!this.isClickOption) {
          this.outFocusValues.emit(true);
          setTimeout(() => {
            this.hideAutocomplete();
          }, 60);
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
    }, 10);
  };

  blur = (value) => {
    const values = this.dataSourceDf.find(
      (m) => m?.value === this.inputControl.value
    );
    if (!values && this.optionSelected.length === 0) {
      this.inputControl.reset();
      this.watchValue.emit({
        value: [],
      });
    }
    return !!values;
  };

  outFocus = () => {
    this.isHideLabel = false;
    setTimeout(() => {
      if (this.maxItem === 1) {
        const values = this.dataSourceDf.find(
          (m) => m?.value === this.selectOne?.value
        );

        if (!values) {
          this.selectOne = {};
          this.watchValue.emit({
            value: [],
          });
          this.dataFilter = [1];
          this.data = this.dataSourceDf;
          this.filteredOptions$ = of(this.dataSourceDf);

          this.onInput.emit({ value: '' });
        } else {
          this.inputControl.patchValue(
            this.modifileOption(this.selectOne?.value) || ''
          );
        }
      } else {
        const values = AitAppUtils.deepCloneArray(this.dataSourceDf).find(
          (m) => m?.value === this.inputControl.value
        );
        if (!values) {
          // this.watchValue.emit({
          //   value: this.optionSelected.map(x => ({ _key: x?._key, value: x?.value })),
          // });
          this.inputControl.setValue(null);
          // this.dataFilter = [1];
          // this.filteredOptions$ = of (this.sortItems(this.DataSource))

          this.onInput.emit({ value: '' });
        }
      }
      this.checkReq();
      this.isHideLabel = false;
    }, 120);
    this.outFocusValues.emit(true);
  };

  checkReq = () => {
    if (this.required) {
      const check =
        this.maxItem === 1
          ? !this.selectOne?.value
          : this.optionSelected.length === 0;
      if (check) {
        const err = this.translateSerivce
          .getMsg('E0001')
          .replace('{0}', this.getFieldName());
        this.isError = true;
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });
      } else {
        this.onError.emit({ isValid: true });
        this.clearErrors();
        this.isError = false;
      }
    } else {
      this.clearErrors();
      this.isError = false;
    }
  };

  onTab = () => {
    if (this.maxItem === 1) {
      const values = this.dataSourceDf.find(
        (f) => f?.value === this.selectOne?.value
      );
      if (values) {
        this.watchValue.emit({
          value: [{ _key: values?._key, value: values?.value }],
        });
      } else {
        this.selectOne = {};
        this.watchValue.emit({
          value: [],
        });
        this.onInput.emit({ value: '' });
      }
    }

    this.hideAutocomplete();
  };

  clearErrors = () => {
    this.componentErrors = [];
    this.errorMessages = [];
    this.isError = false;
  };

  handleClickIcon = () => {
    this.isClickedIcon = true;
    if (this.isOpenAutocomplete) {
      this.dataFilter = [];
      this.isOpenAutocomplete = false;
      setTimeout(() => {
        this.isHideLabel = false;
      }, 50);
    } else {
      setTimeout(() => {
        this.dataFilter = [1];
      }, 50);
    }
  };

  handleInput = (value) => {
    this.isHideLabel = true;
    this.currentValue = value;
    this.clearErrors();
    if (this.maxItem === 1) {
      this.onInput.emit({ value });
      if (value === '') {
        this.selectOne = {};
        this.filteredOptions$ = of(this.dataSourceDf);
        this.watchValue.emit({ value: [] });
      } else {
        const text = value;
        this.selectOne = { value };

        this.data = this._filter(text);
        this.filteredOptions$ = of(this._filter(text));
      }
    } else {
      if (value === '') {
        this.watchValue.emit({
          value: this.optionSelected.map((x) => ({
            _key: x?._key,
            value: x?.value,
          })),
        });
        setTimeout(() => {
          // this.DataSource = this.sortItems(this.DataSource);
          this.dataFilter = [1];
          this.filteredOptions$ = of(this.sortItems(this.DataSource));
        }, 400);
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
        const err = this.translateSerivce
          .getMsg('E0001')
          .replace('{0}', this.getFieldName());
        this.isError = true;
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });
      } else {
        this.onError.emit({ isValid: true });
      }
    }
    this.openAutocomplete();
    this.onInputValues.emit({ value: [{ value }] });
  };

  onSelectionChange($event) {
    this.clearErrors();
    this.selectOne = { _key: $event?._key, value: $event?.value };
    this.inputControl.patchValue($event?.value || '');
    this.onInput.emit({ value: $event?.value });

    this.watchValue.emit({
      value: [
        {
          _key: $event?._key ? $event?._key : $event?.code,
          value: $event?.value,
        },
      ],
    });
    this.getFilteredDataSource();
    if (this.required) {
      if (!this.selectOne?.value) {
        this.isError = true;
        const err = this.translateSerivce
          .getMsg('E0001')
          .replace('{0}', this.getFieldName());
        this.componentErrors = [err];
        this.onError.emit({ isValid: false });
      } else {
        this.onError.emit({ isValid: true });
      }
    }
  }

  getStringByLength = (a: string[], count = 0) => {
    const i = count;
    if (a[i].length >= 10) {
      return a[i].substr(0, 8) + '...';
    } else if ((a[i] || '').length > 8) {
      return this.getStringByLength(a, i + 1)
        ? this.getStringByLength(a, i + 1)
        : a[i - 1];
    }
    return a[i];
  };

  getSelectedItems = (data: any[]) => {
    const itemsText = this.translateSerivce.translate('????????????');
    const target = Array.from(new Set(data.map((m) => m?.value)));
    if ((target || []).length === 1) {
      const statement = target[0];
      return this.modifileOption(statement);
    } else if ((target || []).length !== 1) {
      const index =
        this.allowCheckAll && (this.DataSource || [])[0]?.isChecked
          ? target.length - 2
          : target.length - 1;
      const statement = this.modifileOption(this.getStringByLength(target), 15);
      return statement + `???+${index} ${itemsText})`;
    }
    return '';
  };

  private _filter(value: string): string[] {
    const filterValue = value?.toString().toLowerCase();
    const d = JSON.stringify(this.dataSourceDf);
    const m = JSON.parse(d);

    const result = m.filter((f) => {
      const target = f?.value;
      return target.toString().toLowerCase().includes(filterValue);
    });
    this.dataFilter = filterValue !== '' ? result : this.DataSource;
    return filterValue !== '' ? result : this.DataSource;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (this.allowCheckAll && event.currentIndex === 0) return;
    const eventDrop = this.filteredOptions$.subscribe((data: any[]) => {
      moveItemInArray(data || [], event.previousIndex, event.currentIndex);
      if (this.allowCheckAll) {
        const [, ...returnData] = data;
        this.onDragDrop.emit(returnData);
      } else {
        this.onDragDrop.emit(data);
      }
    });
    eventDrop.unsubscribe();
  }
}
