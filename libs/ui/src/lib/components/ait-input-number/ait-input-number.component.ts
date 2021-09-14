/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { KEYS } from '@ait/shared';
import {
  Component, ElementRef, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
import { AitTranslationService } from '../../services';
import { AitCurrencySymbolService } from '../../services/ait-currency-symbol.service';
import { AitAppUtils } from '../../utils/ait-utils';


@Component({
  selector: 'ait-input-number',
  styleUrls: ['./ait-input-number.component.scss'],
  templateUrl: './ait-input-number.component.html'
})
export class AitInputNumberComponent implements OnChanges, OnInit {
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
  @Input() required = false;
  componentErrors = [];
  dataInput = [];
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = '';
  @Input() styleLabel;
  @Input() width;
  @Input() height;
  @Input() format = '';
  @Input() isSubmit = false;
  @Input() errorMessages = [];
  @Input() clearError = false;
  msgRequired = ''
  isFocus = false;
  @Input() tabIndex;
  valueAppend = '';



  constructor(
    private numberPipe: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService,
    private translateService: AitTranslationService,
    @Inject(LOCALE_ID) public locale: string) {
    this.inputCtrl = new FormControl('');
    this.msgRequired = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
  }

  focusInput() {
    this.isFocus = true;
  }

  getFocus() {
    return this.isError ? false : this.isFocus;
  }
  getPlaceHolder = () => this.translateService.translate(this.placeholder);

  ngOnInit() {
    this.inputCtrl.valueChanges.subscribe({
      next: value => {


      }
    })
  }

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }


  getCaption = () => this.translateService.translate(this.guidance);


  replaceAll(string: string) {
    const target = this.trnData((string || '')).toString();
    const split = target.split('.');
    const split2 = split.join().split(',');
    return split2.join('');
  }

  messagesError = () => Array.from(new Set([...this.componentErrors, ...this.errorMessages]))


  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'defaultValue') {
          // console.log(this.defaultValue)
          let res;
          if (this.defaultValue || [0, '0', '00'].includes(this.defaultValue)) {

            const transform: any = Number(this.defaultValue) < this.max ? this.defaultValue : this.max;
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
              this.inputCtrl.setValue(this.numberPipe.transform(this.defaultValue, this.format) + symbol);
            }
            else if (this.isAge) {
              this.inputCtrl.setValue(this.defaultValue);
            }
            else {
              // console.log(this.defaultValue)
              if ([0, '0', '00'].includes(this.defaultValue)) {
                this.inputCtrl.setValue(0);
              }
              else {
                this.inputCtrl.setValue(this.defaultValue ? this.numberPipe.transform(this.defaultValue, this.format) : null);

              }
            }
          }
        }
        if (key === 'isReset') {
          // // console.log(this.isReset);
          if (this.isReset) {
            this.isError = false;
            this.componentErrors = [];
            this.errorMessages = [];
            this.currentNumber = null;
            this.exactedValue = null;
            this.inputCtrl.patchValue(null);
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
          }
          else {
            if (this.required) {
              if (this.inputCtrl.value && this.inputCtrl.value.length !== 0) {
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


      }
    }
  }

  handleFocus = () => {

    if (this.inputCtrl.value !== '' && this.inputCtrl.value !== null) {
      if ([0, '0', '00'].includes(this.inputCtrl.value)) {
        this.inputCtrl.patchValue(0);
      }
      else {
        this.inputCtrl.patchValue(this.replaceAll(this.inputCtrl.value));

      }
    }
    else {
      this.inputCtrl.patchValue(null);
    }

  }

  handleClick = () => {
  }

  handleFocusOut = () => {

    if (this.valueAppend !== '' && this.valueAppend !== null && this.valueAppend !== undefined) {
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
      this.inputCtrl.patchValue(this.numberPipe.transform(this.replaceAll(this.inputCtrl.value), this.format) + this.symbol);
      this.watchValue.emit(this.replaceAll(this.inputCtrl.value))

    }
    else {

      if (this.inputCtrl.value === null || this.inputCtrl.value === undefined) {
        this.inputCtrl.setValue(null);
        this.watchValue.emit(null)
      }
      else if (this.inputCtrl.value === 0 || this.inputCtrl.value === '0') {
        this.inputCtrl.setValue(0);
        this.watchValue.emit(0)

      }
      else {

        if (this.inputCtrl.value) {
          const target = this.numberPipe.transform(this.inputCtrl.value, this.format);
          this.inputCtrl.setValue(target);
          this.watchValue.emit(Number(this.replaceAll(this.inputCtrl.value)))

        }
        else {
          this.inputCtrl.setValue(null);
          this.watchValue.emit(null)

        }


      }


    }

    if (this.inputCtrl.value === null || this.inputCtrl.value === '') {
      this.lostFocus.emit(null);
    } else {
      this.lostFocus.emit(this.replaceAll(this.inputCtrl.value));
    }
  }
  slugify = str => {
    const map = {
      '-': ' ',
      a: 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
      e: 'é|è|ê|ë|É|È|Ê|Ë',
      i: 'í|ì|î|ï|Í|Ì|Î|Ï',
      o: 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
      u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      c: 'ç|Ç',
      n: 'ñ|Ñ'
    };

    for (const pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }

    return str;
  }

  getPreviousValueInput = () => {
    return this.dataInput[this.dataInput.length - 1] || 0;
  }

  onInput = () => {
    this.dataInput = [...this.dataInput, this.valueAppend];

    // const target = this.replaceAll(this.valueAppend);
    // this.checkReq(target);
    // if (this.valueAppend !== '') {
    //   this.watchValue.emit(!isNaN(Number(target)) ? Number(target) : null);
    // }
    // else {

    //   this.watchValue.emit(null);
    // }

  }

  getFieldName = () => this.translateService.translate(this.label);

  checkReq = (value?: any) => {
    if (this.required) {
      if (!value && value !== 0 && value !== '0') {
        this.isError = true;
        const msg = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.componentErrors = Array.from(new Set([...this.componentErrors, msg]));
        this.onError.emit({ isValid: false });
      }
      else {
        this.componentErrors = [];
        this.errorMessages = [];
        if (this.componentErrors.length === 0) {
          this.isError = false;
          this.onError.emit({ isValid: true });

        }

      }
    }
  }


  trnData = (text: string) => {
    return text?.normalize('NFKC');
  }

  onKeyUp = (evt) => {
    this.currentKey = evt.keyCode;

  }
  isFullSize = (text: string) => {
    const reg = /[\uff00-\uff9f]/;
    return reg.test(text);
  }


  onInputHandle = (text: string) => {
    // const originValue = text?.normalize('NFKC');

    if (this.isFullSize(text)) {
      text = text.replace(this.valueAppend, '');
    }

    this.watchValue.emit(this.replaceAll(text));
    if (text !== '') {
      let res = null;

      if (!isNaN(Number(this.replaceAll(text)))) {

        const transform: any = Number(this.replaceAll(text)) < this.max ? Number(this.replaceAll(text)) : this.max;

        res = Number(transform) > this.min ? transform : this.min;
      }



      this.valueAppend = res;
      this.exactedValue = res;
      this.currentNumber = res;
      this.onInput();
      this.checkReq(text);

    }
    else {
      this.valueAppend = '';

      this.exactedValue = this.valueAppend;
      this.currentNumber = this.valueAppend;
      this.onInput();
      this.checkReq(this.valueAppend);
    }
    // this.watchValue.emit(this.replaceAll(text));
  }


  onKeyDown = (event) => {
    const originValue = event.data?.normalize('NFKC');
    // eslint-disable-next-line no-useless-escape
    const BIRTHNUMBER_ALLOWED_CHARS_REGEXP = /[0-9]+/;
    if (this.currentKey === 8) {
      this.isTooltip = false;
      return true;
    }
    else if (!BIRTHNUMBER_ALLOWED_CHARS_REGEXP.test(originValue)) {
      event.preventDefault();
      this.input.nativeElement.blur();
      this.isTooltip = true;
    }
    else {
      this.isTooltip = false;
    }
  }


  nonAccentVietnamese(str) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7
    //| \u1EA5 | \u1EAD | \u1EA9 | \u1EAB | \u0103 | \u1EB1 | \u1EAF | \u1EB7 | \u1EB3 | \u1EB5 / g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|
    // \u1ED9 | \u1ED5 | \u1ED7 | \u01A1 | \u1EDD | \u1EDB | \u1EE3 | \u1EDF | \u1EE1 / g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
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
