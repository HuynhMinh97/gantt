/* eslint-disable @angular-eslint/no-output-on-prefix */
import { DatePipe } from '@angular/common';
import {
  Component, Inject, Input, LOCALE_ID, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDateFnsDateService } from '@nebular/date-fns';
import { NbDatepickerDirective } from '@nebular/theme';
import { Store, select } from '@ngrx/store';
import { AitTranslationService } from '../../services';
import { AitDateFormatService } from '../../services/common/ait-date.service';
import { AppState } from '../../state/selectors';
import { getSettingLangTime } from '../../state/selectors';
import { AitAppUtils } from '../../utils/ait-utils';
import * as dayjs from 'dayjs';
import { StringDecoder } from 'string_decoder';


@Component({
  selector: 'ait-datepicker',
  styleUrls: ['./ait-datepicker.component.scss'],
  templateUrl: './ait-datepicker.component.html'
})

export class AitDatePickerComponent implements OnInit, OnChanges {
  currentLang = 'en_US';
  formatDateTimeDisplay = '';
  formatDateTimeInput = '';
  formatDateTime = '';
  // formDateControl: FormControl;
  date: Date | number = null;
  @Input() disable = false;
  @Input() dateInput: Date | number = null;
  @Input() defaultValue;
  @Input() placeholder = ''
  @Output() watchValue = new EventEmitter();
  @Input() isRound = false;
  @Input() style: any;
  @Input() styleInput: any;
  @Input() isShow = false;
  @Input() isReset = false;
  @Input() format = null;
  isClickInput = false;
  valueDf = '';
  @Input() isError = false;
  componentErrors = [];
  @Input() required = false;
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = '';
  @Input() id;
  @Input() styleLabel;
  @Input() classContainer;
  @Input() width;
  @Input() height;
  @Output() onError = new EventEmitter();
  @Input() isSubmit = false;
  @Input() errorMessages;
  @Input() tabIndex;

  @ViewChild('inputDateTime', { static: false }) input: ElementRef;
  @ViewChild(NbDatepickerDirective, { static: false }) nbDatepicker;

  formatTransfrom = null;
  isFocus = false;

  inputCtrl: FormControl;
  constructor(
    private store: Store<AppState>,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) public _locale: string,
    private dateService: NbDateFnsDateService,
    private translateService: AitTranslationService,
    private dateFormatService: AitDateFormatService) {
    this.inputCtrl = new FormControl(null);


  }
  // handleBlur = (event) => {
  //   console.log(event);
  // }

  focusInput() {
    this.isFocus = true;
  }

  getFocus() {
    return this.isError ? false : this.isFocus;
  }

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }


  getPlaceHolder = () => this.translateService.translate(this.placeholder);


  getCaption = () => this.translateService.translate(this.guidance);

  messagesError = () => Array.from(new Set([...this.componentErrors, ...(this.errorMessages || [])]))



  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {

        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          }
          else {
            if (this.required) {
              if (this.date) {
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

        if (key === 'isReset') {
          if (this.isReset) {
            this.date = null;
            this.errorMessages = [];
            this.componentErrors = [];
            this.isError = false;
            this.onError.emit({ isValid: null });

            this.isReset = false;
          }
        }

        if (key === 'isSubmit') {
          if (this.isSubmit) {
            this.checkReq(this.date);
          }
        }

        if (key === 'dateInput' && this.dateInput) {
          this.date = new Date(this.dateInput);
          this.setupDate();
        }

        if (key === 'defaultValue') {
          this.dateInput = this.defaultValue;
          this.date = new Date(this.dateInput);
          if (this.required) {
            this.onError.emit({ isValid: !!this.defaultValue })
          }

          this.setupDate();
        }

      }
    }
  }

  getFieldName = () => this.translateService.translate(this.label || '');

  clearErrors = () => {
    this.isError = false;
    this.componentErrors = [];
  }

  checkReq = (value: any) => {

    this.clearErrors();
    if (this.required) {
      if (!value || value === null) {
        this.isError = true;
        const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
        this.onError.emit({ isValid: false });
        this.componentErrors = [err];
      }
      else {
        this.onError.emit({ isValid: true });

      }
    }
  }

  getMessage = () => {
    this.clearErrors();
    const err = this.translateService.getMsg('E0001').replace('{0}', this.getFieldName());
    if (!this.date || !this.inputCtrl.value) {
      this.isError = true;

      return [err];
    }
    else {
      this.isError = false;
      return [];
    }

  }

  getObjectDateTime = (arrayFormat: any[], value: string) => {
    const res: any = {};
    let count = 0;
    //exp : dd/MM/yyyy , 123456
    arrayFormat.forEach((item, index) => {
      const mul = (item?.length || 0) + index * 2;//2 //4 // 8
      res[item] = value.slice(count, mul); //12 //34 //56
      if (res[item] && item.length <= 2) {
        if (res[item].length === 1) {
          res[item] = 0 + res[item];
        }
      }
      else {
        if (res[item].length < 4) {
          res[item] = '';
        }
      }
      count += item?.length; //2 //4 //12
    });

    return res;

  }

  getDaysInMonth = function (month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month + 1, 0).getDate();
  };

  checkValidFormatDate = () => {
    const format = this.getFormat();
    return dayjs(this.inputCtrl.value, format).isValid();
  }

  getCurrentDay = () => {

    return (new Date()).getDate();
  }

  getCurrentYear = () => {

    return (new Date()).getFullYear();
  }

  getCurrentMonth = () => {
    return (new Date()).getMonth();
  }

  getFullDate = (dateString: string) => {
    if (this.isDateValid(dateString)) {

    }
  }

  translateDate = (value: string) => {
    const target = Number(value);

    const $target = target.toString();
    let res = null;
    const priorityDay = this.getFormat().indexOf('d') < this.getFormat().indexOf('M');
    const priorityYear = this.getFormat().indexOf('y') < this.getFormat().indexOf('M');
    // const date = new Date();
    // const lastDay = this.getDaysInMonth(this.getCurrentMonth(), this.getCurrentYear());

    // if (target < 1) {
    //   target = 1;
    // } else if (target > lastDay) {
    //   target = lastDay;
    // }
    // const format = new Date(date.getFullYear(), date.getMonth(), target);
    // console.log(target, format);
    // this.date = format;

    if ($target !== '0') {
      if (value.length === 1) {
        if ($target !== '0') {
          res = new Date(this.getCurrentYear(), this.getCurrentMonth(), target);
        }
      }
      else if (value.length === 2) {
        // case target > lastday of this month
        const lastDay = this.getDaysInMonth(this.getCurrentMonth(), this.getCurrentYear());
        if (target < lastDay) {
          res = new Date(this.getCurrentYear(), this.getCurrentMonth(), target);
        }
        else {
          if (priorityDay) {
            // for day first
            const d_day = Number($target[0]);
            let d_month = Number($target[1]);
            if (d_month < 1 || d_month > 12) {
              d_month = this.getCurrentMonth();
            }
            res = new Date(this.getCurrentYear(), d_month - 1, d_day);
          }
          else {
            //for month first
            const d_month = Number($target[0]);
            const c2_lastDay = this.getDaysInMonth(d_month, this.getCurrentYear());
            let d_day = Number($target[1]);
            if (d_day > c2_lastDay || d_day < 1) {
              d_day = this.getCurrentDay();
            }
            res = new Date(this.getCurrentYear(), d_month - 1, d_day);
          }
        }

      }
      else if (value.length === 3) {

        if (!priorityDay) {
          let c3_month = Number(value[0] + value[1]);
          let c3_day = Number(value[2]);
          if (c3_month > 12) {
            c3_month = Number(value[0]);
            c3_day = Number(value[1] + value[2])
          }
          const c3_lastDay = this.getDaysInMonth(c3_month, this.getCurrentYear());
          // console.log(c3_month, c3_lastDay, c3_day);
          if (c3_day > c3_lastDay || c3_day < 1) {
            res = null;
          }
          else {
            res = new Date(this.getCurrentYear(), c3_month - 1, c3_day);
          }

        }
        else {
          let c3_e_day = Number(value[0] + value[1]);
          let c3_e_month = Number(value[2]);
          const c3_e_lastDay = this.getDaysInMonth(c3_e_month, this.getCurrentYear());
          if (c3_e_day < 1 || c3_e_day > c3_e_lastDay) {
            c3_e_day = Number(value[0]);
            c3_e_month = Number(value[1] + value[2]);
            if (c3_e_month < 1 || c3_e_month > 12) {
              // c3_e_month = this.getCurrentMonth();
              res = null;
            }
            else {
              res = new Date(this.getCurrentYear(), c3_e_month - 1, c3_e_day);
            }
          }

        }
      }
      else if (value.length === 4) {
        if (!priorityDay) {
          const c4_month = Number(value[0] + value[1]);
          const c4_day = Number(value[2] + value[3]);
          if (c4_month > 12) {
            res = null;
          }
          else {
            const c4_lastDay = this.getDaysInMonth(c4_month, this.getCurrentYear());

            if (c4_day < 0 || c4_day > c4_lastDay) {
              res = null;
            }
            else {

              res = new Date(this.getCurrentYear(), c4_month - 1, c4_day);
              // console.log(this.getCurrentYear(), c4_month -1, c4_day, res)
            }
          }
        }
        else {
          const c4_day = Number(value[0] + value[1]);
          const c4_month = Number(value[2] + value[3]);
          if (c4_month > 12) {
            res = null;
          }
          else {
            const c4_lastDay = this.getDaysInMonth(c4_month, this.getCurrentYear());

            if (c4_day < 0 || c4_day > c4_lastDay) {
              res = null;
            }
            else {

              res = new Date(this.getCurrentYear(), c4_month - 1, c4_day);
              // console.log(this.getCurrentYear(), c4_month -1, c4_day, res)
            }
          }
        }
      }
      else if (value.length < 8 && value.length > 4) {
        if (priorityYear) {
          let ct8_year = Number(value.slice(0, 4));
          const $v = value.slice(4);
          const $tar = Number($v);
          // console.log(ct8_year)
          if (ct8_year.toString().length < 4) {
            ct8_year = this.getCurrentYear();
          }
          if ($v.length <= 2) {
            const lastDay = this.getDaysInMonth(this.getCurrentMonth(), ct8_year);
            if ($tar < lastDay) {
              res = new Date(ct8_year, this.getCurrentMonth(), $tar);
            }
            else {
              if (priorityDay) {
                // for day first
                const d_day = Number($v[0]);
                let d_month = Number($v[1]);
                if (d_month < 1 || d_month > 12) {
                  d_month = this.getCurrentMonth();
                }
                res = new Date(ct8_year, d_month - 1, d_day);
              }
              else {
                //for month first
                const d_month = Number($v[0]);
                const c2_lastDay = this.getDaysInMonth(d_month, ct8_year);
                let d_day = Number($v[1]);
                if (d_day > c2_lastDay || d_day < 1) {
                  d_day = this.getCurrentDay();
                }
                res = new Date(ct8_year, d_month - 1, d_day);
              }
            }
          }
          if ($v.length === 4) {
            if (!priorityDay) {
              const c4_month = Number($v[0] + $v[1]);
              const c4_day = Number($v[2] + $v[3]);
              if (c4_month > 12) {
                res = null;
              }
              else {
                const c4_lastDay = this.getDaysInMonth(c4_month, ct8_year);

                if (c4_day < 0 || c4_day > c4_lastDay) {
                  res = null;
                }
                else {

                  res = new Date(ct8_year, c4_month - 1, c4_day);
                  // console.log(this.getCurrentYear(), c4_month -1, c4_day, res)
                }
              }
            }
            else {
              const c4_day = Number($v[0] + $v[1]);
              const c4_month = Number($v[2] + $v[3]);
              if (c4_month > 12) {
                res = null;
              }
              else {
                const c4_lastDay = this.getDaysInMonth(c4_month, ct8_year);

                if (c4_day < 0 || c4_day > c4_lastDay) {
                  res = null;
                }
                else {

                  res = new Date(ct8_year, c4_month - 1, c4_day);
                  // console.log(this.getCurrentYear(), c4_month -1, c4_day, res)
                }
              }
            }
          }

          if ($v.length === 3) {
            if (!priorityDay) {
              let c3_month = Number($v[0] + $v[1]);
              let c3_day = Number($v[2]);
              if (c3_month > 12) {
                c3_month = Number($v[0]);
                c3_day = Number($v[1] + $v[2])
              }
              const c3_lastDay = this.getDaysInMonth(c3_month, ct8_year);
              // console.log(c3_month, c3_lastDay, c3_day);
              if (c3_day > c3_lastDay || c3_day < 1) {
                res = null;
              }
              else {
                res = new Date(ct8_year, c3_month - 1, c3_day);
              }

            }
            else {
              let c3_e_day = Number($v[0] + $v[1]);
              let c3_e_month = Number($v[2]);
              const c3_e_lastDay = this.getDaysInMonth(c3_e_month, ct8_year);
              if (c3_e_day < 1 || c3_e_day > c3_e_lastDay) {
                c3_e_day = Number($v[0]);
                c3_e_month = Number($v[1] + $v[2]);
                if (c3_e_month < 1 || c3_e_month > 12) {
                  // c3_e_month = this.getCurrentMonth();
                  res = null;
                }
                else {
                  res = new Date(ct8_year, c3_e_month - 1, c3_e_day);
                }
              }

            }
          }

        }
        else {

        }
      }
      else if (value.length === 8) {
        if (!priorityYear) {
          let ct_month = isNaN(Number(value[2] + value[3])) ? 0 : Number(value[2] + value[3]);
          let ct_day = isNaN(Number(value[0] + value[1])) ? 0 : Number(value[0] + value[1]);
          let ct_year = Number(value.slice(4, value.length));


          if (ct_year.toString().length < 4) {
            ct_year = this.getCurrentYear()
          }
          if (ct_month < 1 || ct_month > 12) {
            ct_month = this.getCurrentMonth();
          }
          const ct_lastDay = this.getDaysInMonth(ct_month, this.getCurrentYear());
          if (ct_day < 1 || ct_day > ct_lastDay) {
            ct_day = this.getCurrentDay();
          }
          res = new Date(ct_year, ct_month - 1, ct_day);
        }
        else {
          let ct_month = isNaN(Number(value[4] + value[5])) ? 0 : Number(value[4] + value[5]);
          let ct_day = isNaN(Number(value[6] + value[7])) ? 0 : Number(value[6] + value[7]);
          let ct_year = Number(value.slice(0, 4));
          // console.log(ct_year, ct_month, ct_day)

          if (ct_year.toString().length < 4) {
            ct_year = this.getCurrentYear()
          }
          if (ct_month < 1 || ct_month > 12) {
            ct_month = this.getCurrentMonth();
          }
          const ct_lastDay = this.getDaysInMonth(ct_month, this.getCurrentYear());
          if (ct_day < 1 || ct_day > ct_lastDay) {
            ct_day = this.getCurrentDay();
          }
          res = new Date(ct_year, ct_month - 1, ct_day);
        }
      }
    }

    // console.log(res);


    this.formatTransfrom = res?.getTime();
  }
  evaluteYear(value: string) {
    const evalue = new Date(Number(value), this.getCurrentMonth());
    this.formatTransfrom = evalue.getTime();
  }

  evaluteMonth(value: string) {
    const evalue = new Date(this.getCurrentYear(), Number(value) - 1);
    this.formatTransfrom = evalue.getTime();
  }

  evaluteDay(value: string) {
    const evalue = new Date(this.getCurrentYear(), this.getCurrentMonth(), Number(value));
    this.formatTransfrom = evalue.getTime();
  }

  evaluteYearMonth(value: string, isReverse = false) {
    let mainVal = [];
    if (value.includes('-')) {
      const v = value.split('-');
      mainVal = [v[0], v[1]];
      if (isReverse) {
        mainVal = [v[1], v[0]];
      }
    }
    else if (value.includes('/')) {
      const v = value.split('/');
      mainVal = [v[0], v[1]];
      if (isReverse) {
        mainVal = [v[1], v[0]];
      }
    }
    else {
      if (isReverse) {
        const d = value.substring(0, 2);
        const y = value.substring(2);
        mainVal = [y, d];
      }
      else {
        const y = value.substring(0, 4);
        const d = value.substring(4);
        mainVal = [y, d];
      }
    }
    const evalue = new Date(Number(mainVal[0]), Number(mainVal[1]) - 1, this.getCurrentDay());
    this.formatTransfrom = evalue.getTime();
  }

  isFullSize = (text: string) => {
    const reg = /[\uff00-\uff9f]/;
    return reg.test(text);
  }


  converToDateTime = (date) => (new Date(date)).getTime();
  handleInput = (event) => {
    let text = event.target.value;

    if (this.isFullSize(event.target.value)) {
      text = event.target.value?.normalize('NFKC');
    }
    // this.inputCtrl.patchValue(text);
    this.nbDatepicker.hidePicker();
    if (text && text !== '') {
      if (this.format === 'yyyy') {
        this.evaluteYear(text);
      }
      else if (this.format === 'MM') {
        this.evaluteMonth(text);
      }
      else if (this.format === 'dd') {
        this.evaluteDay(text);
      }
      else if (this.format === 'yyyy/MM' || this.format === 'MM/yyyy') {
        console.log(text);
        this.evaluteYearMonth(text, this.format === 'MM/yyyy');
      }
      else {
        this.translateDate(text);
        if (text?.length > 2) {
        }
        else {
          if (text) {
            this.translateDate(text);
          }
          else {
            this.formatTransfrom = null;
          }


        }
        if (this.required) {
          this.componentErrors = this.getMessage();
        }
      }
    }
    else {
      // this.formatTransfrom = null;
      if (this.formatTransfrom === null || this.formatTransfrom === '') {
        this.watchValue.emit({ value: null });
      }
      if (this.required) {
        this.componentErrors = this.getMessage();
      }
    }
  }

  onBeforeInput = (e) => {
    const allowThings = /[0-9]+/;
    if (!allowThings.test(e.data) && e.inputType !== 'deleteContentBackward') {
      e.preventDefault();
    }
  }

  dateChange = (date) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => { };
    const unix = (new Date(date)).getTime();
    this.checkReq(unix);
    this.dateInput = unix;
    this.date = new Date(this.dateInput);
    // console.log(unix)
    this.watchValue.emit({ value: unix })
  }


  getFormat = (): string => {
    const format = this.disable ? this.formatDateTimeDisplay : this.formatDateTimeInput;

    const res = this.format || format;
    return res || 'yyyy/MM/dd';
  }
  isDateValid = (val) => {
    if (typeof val === 'number') {
      return true;
    }
    return val instanceof Date && !isNaN(val.valueOf()) && this.dateFormatService.isRightFormatDate(val, this.getFormat());
  }

  checkValidDateInput = () => {
    console.log(this.formatTransfrom);
    if (this.formatTransfrom) {
      this.date = new Date(this.formatTransfrom);
      this.dateInput = this.formatTransfrom;
      this.watchValue.emit({ value: this.formatTransfrom });
      this.checkReq(this.formatTransfrom);
      this.formatTransfrom = null;
    }
    else {

      if (!this.isDateValid(this.date) || !this.inputCtrl.value) {
        this.date = null;


        this.inputCtrl.reset();
        this.watchValue.emit({ value: null });
      }
      else {
        // this.watchValue.emit({ value: (new Date(this.date)).getTime() });
      }
    }
    if (!this.isDateValid(this.date)) {
      this.date = null;

      this.inputCtrl.reset();
      this.watchValue.emit({ value: null });
    }

    this.checkReq(this.date);
  }



  clickInput = (date) => {

    this.nbDatepicker.hidePicker()
  }

  clickIconDate = () => {
    this.input.nativeElement.focus();
  }

  getCurrentLocale = () => this.currentLang.replace('_', '-');

  setupDate = () => {
    this.store.pipe(select(getSettingLangTime)).subscribe(setting => {

      if (this.currentLang !== setting?.site_language) {
        this.currentLang = setting?.site_language || 'ja_JP';

      }
      if (this.formatDateTimeDisplay !== setting?.date_format_display) {
        this.formatDateTimeDisplay = setting?.date_format_display;

      }
      if (this.formatDateTimeInput !== setting?.date_format_input) {
        this.formatDateTimeInput = setting?.date_format_input;

      }
      // const formatTime = this.formatDateTimeInput || this.formatDateTimeDisplay;
      this.format = this.getFormat();

      if (this.format) {
        if (AitAppUtils.isValidDate(this.dateInput) || typeof this.dateInput === 'number') {
          if (this.dateInput) {
            let dateFormat;
            if (this.disable) {
              dateFormat = this.dateFormatService.formatDatePicker(this.dateInput, this.formatDateTimeDisplay);
              // // console.log(dateFormat)
              this.valueDf = dateFormat
            }
            else {
              // dateFormat = this.dateFormatService.formatDatePicker(this.dateInput, this.formatDateTimeInput)
            }
            this.date = new Date(this.dateInput);
          }
        }
        else {
          this.date = null;
        }
      }

    })
  }


  ngOnInit() {
    if (this.defaultValue && this.defaultValue !== '') {
      this.setupDate();
      const target = this.defaultValue || this.dateInput
      this.watchValue.emit({ value: target ? (new Date(target)).getTime() : target });
    }
    else {
      this.watchValue.emit({ value: this.defaultValue });
    }
  }
}
