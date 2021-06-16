/* eslint-disable @angular-eslint/no-output-on-prefix */
import { DatePipe } from '@angular/common';
import {
  Component, Inject, Input, LOCALE_ID, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDatepickerDirective } from '@nebular/theme';
import { Store, select } from '@ngrx/store';
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

  @ViewChild('inputDateTime', { static: false }) input: ElementRef;
  @ViewChild(NbDatepickerDirective, { static: false }) nbDatepicker;

  inputCtrl: FormControl;
  constructor(
    private store: Store<AppState>,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private _locale: string,
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

  converToDateTime = (date) => (new Date(date)).getTime();

  dateChange = (date) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => { };
    const unix = (new Date(date)).getTime();
    this.dateInput = unix;
    this.date = new Date(this.dateInput);
    this.onDateChange.emit({ value: unix })
  }


  getFormat = () => {
    const format = this.disable ? this.formatDateTimeDisplay : this.formatDateTimeInput;

    return format || 'yyyy/MM/dd';
  }
  isDateValid = (val) => val instanceof Date && !isNaN(val.valueOf()) && this.dateFormatService.isRightFormatDate(val, this.getFormat());

  checkValidDateInput = () => {
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
      console.log(setting)
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
