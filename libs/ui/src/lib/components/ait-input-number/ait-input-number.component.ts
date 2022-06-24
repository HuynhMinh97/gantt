/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
import {
  AitAuthService,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
} from '../../services';
import { AitCurrencySymbolService } from '../../services/ait-currency-symbol.service';
import { AppState, getUserSetting } from '../../state/selectors';
import { AitBaseComponent } from '../base.component';

@Component({
  selector: 'ait-input-number',
  styleUrls: ['./ait-input-number.component.scss'],
  templateUrl: './ait-input-number.component.html',
})
export class AitInputNumberComponent
  extends AitBaseComponent
  implements OnChanges {
  @Input() min = 0;
  @Input() max = 999999999999;
  @Input() length = 15;
  @Input() widthInput = '250px';
  @Input() placeholder = '';
  @Input() defaultValue: string;
  @Output() watchValue = new EventEmitter();
  @Output() lostFocus = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onError = new EventEmitter();

  @Input() styleInput: any = {};
  inputCtrl: FormControl;
  @Input() isReadOnly = false;
  @Input() isCurrency = false;
  @Input() isAge = false;
  exactedValue = '';
  currentKey: any = 0;
  eventData: any = 0;
  isTrick = false;
  @ViewChild('inputNumber', { static: false }) input: ElementRef;
  isTooltip = false;
  @Input() id;
  @Input() classContainer;

  currentNumber: any = '';
  previousValue: any = '';
  symbol = '円';

  @Input() isReset = false;
  @Input() isError = false;
  @Input() isLeftPlaceholder = false;
  @Input() required = false;
  componentErrors = [];
  dataInput = [];
  @Input() label;
  @Input() guidance = '';
  @Input() guidanceIcon = '';
  @Input() styleLabel;
  @Input() width;
  @Input() height;
  @Input() format = '';
  @Input() isSubmit = false;
  @Input() errorMessages = [];
  @Input() clearError = false;
  msgRequired = '';
  isFocus = false;
  @Input() tabIndex;
  valueAppend = '';

  constructor(
    private numberPipe: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService,
    private translateService: AitTranslationService,
    store: Store<AppState>,
    toastrService: NbToastrService,
    authService: AitAuthService,
    private translatePipe: AitTranslationService,
    public userService: AitUserService,
    envService: AitEnvironmentService,
    apollo: Apollo,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      envService,
      null,
      toastrService
    );
    this.inputCtrl = new FormControl('');
    this.msgRequired = this.translateService
      .getMsg('E0001')
      .replace('{0}', this.getFieldName());

    store.pipe(select(getUserSetting)).subscribe((set) => {
      if (set) {
        this.format = set['number_format'] || '';
      }
    });
  }

  focusInput() {
    this.isFocus = true;
  }

  getFocus() {
    return this.isError ? false : this.isFocus;
  }
  getPlaceHolder = () => this.translateService.translate(this.placeholder);

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  getCaption2 = () => this.translateService.translate(this.guidance);

  replaceAll(string: string) {
    const target = this.trnData(string || '').toString();
    const split = target.split(',').join('');
    return Number(split).toString();
  }

  messagesError = () =>
    Array.from(new Set([...this.componentErrors, ...this.errorMessages]));

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'defaultValue') {
          let res;
          if (this.defaultValue || [0, '0', '00'].includes(this.defaultValue)) {
            const transform: any =
              Number(this.defaultValue) < this.max
                ? this.defaultValue
                : this.max;
            const res = Number(transform) > this.min ? transform : this.min;
            this.watchValue.emit(res);
            this.currentNumber = res;
            this.defaultValue = res;
          }

          if (this.required) {
            this.onError.emit({ isValid: res && (res || '').length !== 0 });
          }

          if (this.defaultValue || [0, '0', '00'].includes(this.defaultValue)) {
            if (this.isCurrency) {
              const symbol = this.currencySymbolService.getCurrencyByLocale();
              this.symbol = symbol;
              this.inputCtrl.setValue(
                this.numberPipe.transform(this.defaultValue, this.format) +
                  symbol
              );
            } else if (this.isAge) {
              this.inputCtrl.setValue(this.defaultValue);
            } else {
              if ([0, '0', '00'].includes(this.defaultValue)) {
                this.inputCtrl.setValue(0);
              } else {
                this.inputCtrl.setValue(
                  this.defaultValue ? this.defaultValue : null
                );
              }
            }
          }
        }
        if (key === 'isReset') {
          if (this.isReset) {
            this.isError = false;
            this.componentErrors = [];
            this.errorMessages = [];
            this.currentNumber = null;
            this.exactedValue = null;
            this.valueAppend = '';
            this.inputCtrl.patchValue(null);
            this.inputCtrl.reset();
            this.watchValue.emit(null);
            this.onError.emit({ isValid: null });

            this.isReset = false;
          }
        }
        if (key === 'isSubmit') {
          if (this.isSubmit) {
            this.checkReq(this.inputCtrl.value);
          }
        }

        if (key === 'clearError') {
          if (this.clearError) {
            this.isError = false;
            this.componentErrors = [];
            this.errorMessages = [];
          }
        }

        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          } else {
            if (this.required) {
              if (this.inputCtrl.value && this.inputCtrl.value.length !== 0) {
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
      }
    }
  }

  handleFocus = () => {
    if (this.inputCtrl.value !== '' && this.inputCtrl.value !== null) {
      if ([0, '0', '00'].includes(this.inputCtrl.value)) {
        this.inputCtrl.patchValue(0);
      } else {
        this.inputCtrl.patchValue(this.replaceAll(this.inputCtrl.value));
      }
    } else {
      this.inputCtrl.patchValue(null);
    }
  };

  handleClick = () => {};

  handleFocusOut = () => {
    if (
      this.valueAppend !== '' &&
      this.valueAppend !== null &&
      this.valueAppend !== undefined
    ) {
      this.inputCtrl.setValue(null);
      this.inputCtrl.patchValue(this.valueAppend);
    }

    this.checkReq(this.inputCtrl.value);

    if (this.inputCtrl.value === '' || this.inputCtrl.value === null) {
      this.inputCtrl.patchValue(null);
      this.watchValue.emit(null);
      return;
    }

    if (this.isCurrency) {
      this.inputCtrl.patchValue(
        this.numberPipe.transform(
          this.replaceAll(this.inputCtrl.value),
          this.format
        ) + this.symbol
      );
      this.watchValue.emit(this.replaceAll(this.inputCtrl.value));
    } else {
      if (this.inputCtrl.value === null || this.inputCtrl.value === undefined) {
        this.inputCtrl.setValue(null);
        this.watchValue.emit(null);
      } else if (this.inputCtrl.value === 0 || this.inputCtrl.value === '0') {
        this.inputCtrl.setValue(0);
        this.watchValue.emit(0);
      } else {
        if (this.inputCtrl.value) {
          this.watchValue.emit(Number(this.replaceAll(this.inputCtrl.value)));
        } else {
          this.inputCtrl.setValue(null);
          this.watchValue.emit(null);
        }
      }
    }

    if (this.inputCtrl.value === null || this.inputCtrl.value === '') {
      this.lostFocus.emit(null);
    } else {
      this.lostFocus.emit(this.replaceAll(this.inputCtrl.value));
    }
  };

  slugify = (str) => {
    const map = {
      '-': ' ',
      a: 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
      e: 'é|è|ê|ë|É|È|Ê|Ë',
      i: 'í|ì|î|ï|Í|Ì|Î|Ï',
      o: 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
      u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      c: 'ç|Ç',
      n: 'ñ|Ñ',
    };

    for (const pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }

    return str;
  };

  getPreviousValueInput = () => {
    return this.dataInput[this.dataInput.length - 1] || 0;
  };

  onInput = () => {
    this.dataInput = [...this.dataInput, this.valueAppend];
  };

  getFieldName = () => this.translateService.translate(this.label);

  checkReq = (value?: any) => {
    if (this.required) {
      if (!value && value !== 0 && value !== '0') {
        this.isError = true;
        const msg = this.translateService
          .getMsg('E0001')
          .replace('{0}', this.getFieldName());
        this.componentErrors = Array.from(
          new Set([...this.componentErrors, msg])
        );
        this.onError.emit({ isValid: false });
      } else {
        this.componentErrors = [];
        this.errorMessages = [];
        if (this.componentErrors.length === 0) {
          this.isError = false;
          this.onError.emit({ isValid: true });
        }
      }
    }
  };

  trnData = (text: string) => {
    try {
      return text?.normalize('NFKC');
    } catch (e) {
      return text;
    }
  };

  onKeyUp = (evt) => {
    this.currentKey = evt.keyCode;
  };
  isFullSize = (text: string) => {
    const reg = /[\uff00-\uff9f]/;
    return reg.test(text);
  };

  onInputHandle = (text: string) => {
    if (this.isFullSize(text)) {
      text = text.replace(this.valueAppend, '');
    }

    this.watchValue.emit(this.replaceAll(text));
    if (text !== '') {
      let res = null;

      if (!isNaN(Number(this.replaceAll(text)))) {
        const transform: any =
          Number(this.replaceAll(text)) < this.max
            ? Number(this.replaceAll(text))
            : this.max;

        res = Number(transform) > this.min ? transform : this.min;
      }

      this.valueAppend = res;
      this.exactedValue = res;
      this.currentNumber = res;
      this.onInput();
      this.checkReq(text);
    } else {
      this.valueAppend = '';

      this.exactedValue = this.valueAppend;
      this.currentNumber = this.valueAppend;
      this.onInput();
      this.checkReq(this.valueAppend);
    }
    // this.watchValue.emit(this.replaceAll(text));
  };

  onKeyDown = (event) => {
    const originValue = event.data?.normalize('NFKC');
    // eslint-disable-next-line no-useless-escape
    const BIRTHNUMBER_ALLOWED_CHARS_REGEXP = /^\d*\.?\d*$/;
    if (this.currentKey === 8 || this.currentKey === 46) {
      this.isTooltip = false;
      return true;
    } else if (!BIRTHNUMBER_ALLOWED_CHARS_REGEXP.test(originValue)) {
      event.preventDefault();
      this.input.nativeElement.blur();
      this.isTooltip = true;
    } else {
      this.isTooltip = false;
    }
  };

  nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
  }
}
