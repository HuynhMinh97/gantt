/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { KEYS } from '@ait/shared';
import {
  Component, ElementRef, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
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
  @Input() maxLength = 15;
  @Input() widthInput = '250px';
  @Input() salaryPlaceholder = '';
  @Input() defaultValue = null;
  @Output() watchValue = new EventEmitter();
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
  inputId = Date.now() + AitAppUtils.random(0, 100);

  currentNumber = '';
  previousValue: any = '';
  symbol = '円';
  @Input() isReset = false;
  dataInput = [];

  @Input() staticFormat = '###,###,###';

  constructor(
    private numberPipe: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService,
    @Inject(LOCALE_ID) public locale: string) {
    this.inputCtrl = new FormControl('');

  }

  ngOnInit() {
    this.inputCtrl.valueChanges.subscribe({
      next: value => {
        // console.log(value)
        // this.currentNumber = value;

      }
    })
  }

  replaceAll(string: string) {
    const target = string.toString();
    const split = target.split('.');
    const split2 = split.join().split(',');
    return split2.join('');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'isReset') {
          if (this.isReset) {
            this.inputCtrl.patchValue('');
          }
        }
        if (key === KEYS.DEFAULT_VALUE && this.defaultValue) {
          this.currentNumber = this.defaultValue;

          if (this.isCurrency) {
            const symbol = this.currencySymbolService.getCurrencyByLocale();
            this.symbol = symbol;
            this.inputCtrl.setValue(this.numberPipe.transform(this.defaultValue, this.staticFormat) + symbol);
          }
          else if (this.isAge) {
            this.inputCtrl.setValue(this.defaultValue);
          }
          else {
            this.inputCtrl.setValue(this.defaultValue ? this.numberPipe.transform(this.defaultValue, this.staticFormat) : null);

          }
        }

      }
    }
  }

  handleFocus = () => {
    if (this.currentNumber !== '') {
      this.inputCtrl.patchValue(this.replaceAll(this.currentNumber));
    }
    else {
      this.inputCtrl.patchValue(null);
    }

  }

  handleClick = () => {
  }

  handleFocusOut = () => {

    if (!this.currentNumber) {
      this.inputCtrl.patchValue(null);
      return;
    }
    if (this.isCurrency) {
      this.inputCtrl.patchValue(this.numberPipe.transform(this.replaceAll(this.currentNumber), this.staticFormat) + this.symbol);
    }
    else {
      // console.log(this.currentNumber)
      const target = this.numberPipe.transform(this.replaceAll(this.currentNumber), this.staticFormat);
      // console.log(target)
      this.inputCtrl.setValue(target);
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

  onInput = (text: string) => {
    this.dataInput = [...this.dataInput, text];
    this.exactedValue = text;
    this.currentNumber = text;
    const target = this.replaceAll(text);

    if (text !== '') {
      this.watchValue.emit(!isNaN(Number(target)) ? Number(target) : null);
    }
    else {
      this.watchValue.emit(null);
    }

  }



  onKeyUp = (evt) => {
    this.currentKey = evt.keyCode;
  }


  onKeyDown = (event) => {
    // eslint-disable-next-line no-useless-escape
    const BIRTHNUMBER_ALLOWED_CHARS_REGEXP = /[0-9]+/;
    if (this.currentKey === 8) {
      this.isTooltip = false;
      return true;
    }
    else if (!BIRTHNUMBER_ALLOWED_CHARS_REGEXP.test(event.data)) {
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