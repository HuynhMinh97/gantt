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
  @Input() placeholder = 'Pick date'
  @Output() onDateChange = new EventEmitter();
  @Input() isRound = false;
  @Input() style: any;
  @Input() styleInput: any;
  @Input() isShow = false;
  @Input() isReset = false;
  @Input() staticFormat = null;
  isClickInput = false;
  valueDf = '';
  @Input() isError = false;
  errors = [];
  @Input() required = false;

  @ViewChild('inputDateTime', { static: false }) input: ElementRef;
  @ViewChild(NbDatepickerDirective, { static: false }) nbDatepicker;

  formatTransfrom = null;

  inputCtrl: FormControl;
  constructor(
    private store: Store<AppState>,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private _locale: string,
    private dateService: NbDateFnsDateService,
    private translateService: AitTranslationService,
    private dateFormatService: AitDateFormatService) {
    this.inputCtrl = new FormControl(null);


  }


  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {

        if (key === 'isReset') {
          if (this.isReset) {
            this.date = null;
          }
        }

        if (key === 'dateInput' && this.dateInput) {
          this.setupDate();
        }

      }
    }
  }

  clearErrors = () => {
    this.isError = false;
    this.errors = [];
  }

  checkReq = (value: any) => {
    this.clearErrors();
    if (this.required) {
      if (value === '') {
        this.isError = true;
        const err = this.translateService.getMsg('E0041');
        this.errors = [err];
      }
    }
  }

  getMessage = () => {
    this.clearErrors();
    const err = this.translateService.getMsg('E0041');
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

  translateDate = (value) => {
    const symbol = this.staticFormat.includes('-') ? '-' : '/';
    const formatArray = this.staticFormat.split(symbol);
    const target = value;
    const d = this.getObjectDateTime(formatArray, target);

    const format = new Date();
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const lastDay = new Date(y, m + 1, 0);
    formatArray.forEach(item => {
      if (d[item] && item) {
        if (item.includes('d')) {
          const dd = Number(d[item]) > lastDay.getDate() ? lastDay : d[item];
          format.setDate(dd)
        }
        else if (item.includes('M')) {
          const MM = Number(d[item] - 1) > 12 ? 12 : d[item] - 1
          format.setMonth(MM)
        }
        else {

          format.setFullYear(d[item])
        }
      }
    })

    this.formatTransfrom = format.getTime();
  }

  converToDateTime = (date) => (new Date(date)).getTime();
  handleInput = (event) => {
    if (event.target.value) {
      this.translateDate(event.target.value);
    }
    else {
      this.formatTransfrom = null;
    }

    this.errors = this.getMessage();
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
    this.onDateChange.emit({ value: unix })
  }


  getFormat = () => {
    const format = this.disable ? this.formatDateTimeDisplay : this.formatDateTimeInput;

    return format || 'yyyy/MM/dd';
  }
  isDateValid = (val) => {
    if (typeof val === 'number') {
      return true;
    }
    return val instanceof Date && !isNaN(val.valueOf()) && this.dateFormatService.isRightFormatDate(val, this.getFormat());
  }

  checkValidDateInput = () => {
    if (this.formatTransfrom) {
      this.date = new Date(this.formatTransfrom);
      this.dateInput = this.formatTransfrom;
      this.onDateChange.emit({ value: this.formatTransfrom });
      this.checkReq(this.formatTransfrom);
      this.formatTransfrom = null;
    }
    if (!this.isDateValid(this.date)) {
      this.date = null;
      this.inputCtrl.reset();
      this.onDateChange.emit({ value: null });
    }
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
      const formatTime = this.formatDateTimeInput || this.formatDateTimeDisplay;
      this.staticFormat = formatTime;

      if (formatTime) {

        if (AitAppUtils.isValidDate(this.dateInput) || typeof this.dateInput === 'number') {
          if (this.dateInput) {
            let dateFormat;
            if (this.disable) {
              dateFormat = this.dateFormatService.formatDatePicker(this.dateInput, this.formatDateTimeDisplay);
              // console.log(dateFormat)
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
    this.setupDate();
    this.onDateChange.emit({ value: this.dateInput ? (new Date(this.dateInput)).getTime() : this.dateInput });
  }
}
