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

  ID(element: string): string {
    return this.id + '_' + element;
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
    // return new Date(year, month+1, 0).getDate();
  };

  translateDate = (value) => {
    let target = Number(value)
    const date = new Date();
    const lastDay = this.getDaysInMonth(date.getMonth(), date.getFullYear());

    if (target < 1) {
      target = 1;
    } else if (value > lastDay) {
      target = lastDay;
    }
    const format = new Date(date.getFullYear(), date.getMonth(), target);


    this.formatTransfrom = format.getTime();
  }

  converToDateTime = (date) => (new Date(date)).getTime();
  handleInput = (event) => {
    if (event.target.value) {
      if (event.target.value?.length > 2) {
        try {
          const dt = new Date(event.target.value);
          this.watchValue.emit({ value: dt.getTime() });
        } catch (error) {
          this.watchValue.emit(null);
        }
        if (this.required) {
          this.componentErrors = this.getMessage();
        }
      }
      else {
        if (event.target.value) {
          this.translateDate(event.target.value);
        }
        else {
          this.formatTransfrom = null;
        }

        if (this.required) {
          this.componentErrors = this.getMessage();
        }
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
    this.watchValue.emit({ value: unix })
  }


  getFormat = () => {
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
    if (this.formatTransfrom) {
      this.date = new Date(this.formatTransfrom);
      this.dateInput = this.formatTransfrom;
      this.watchValue.emit({ value: this.formatTransfrom });
      this.checkReq(this.formatTransfrom);
      this.formatTransfrom = null;
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
      const formatTime = this.formatDateTimeInput || this.formatDateTimeDisplay;
      this.format = this.getFormat();

      if (formatTime) {
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
    this.setupDate();
    const target = this.defaultValue || this.dateInput
    this.watchValue.emit({ value: target ? (new Date(target)).getTime() : target });
  }
}
