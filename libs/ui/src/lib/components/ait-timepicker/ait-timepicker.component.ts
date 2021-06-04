/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ait-timepicker',
  templateUrl: 'ait-timepicker.component.html',
  styleUrls:['./ait-timepicker.component.scss']

})

export class AitTimepickerComponent implements  OnChanges {
  constructor() {
    this.timeChanged = new FormControl('');
  }

  timeChanged: FormControl;
  @Input() isTuples = true;
  @Input() ishourValue;
  @Input() isminuteValue;
  @Output() watchValue = new EventEmitter();
  @Input() placeholder;
  @Input() mode: 'dark' | 'light' = 'light';
  hourField: string;
  minField: string;
  @Input() isReset = false;


  get PLACEHOLDER(): string {
    return this.placeholder ? this.placeholder
      : this.ishourValue ? 'HH' : 'mm'
  }

  get TIME_FORMAT(): string {
    return this.ishourValue ? 'HH' : 'mm';
  }

  get STEP(): number {
    return this.ishourValue ? 60 : 5;
  }

  outFocus = () => {
    this.getTime(this.time);
  }

  getTimeChanged = (value) => {
    if (this.isTuples) {
      const date = new Date(value.time);
      this.watchValue.emit({
        [this.minField]: date.getMinutes(),
        [this.hourField]: date.getHours()
      })
    }
    else {
      const date = new Date(value.time);
      if (this.ishourValue) {
        this.watchValue.emit({
          [this.hourField]: date.getHours()
        })
      }
      if (this.isminuteValue) {
        this.watchValue.emit({
          [this.minField]: date.getMinutes()
        })
      }

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const element = changes[key].currentValue;
        if (key === 'time') {

          if (element) {
            this.getTime(element)

          }

        }

      }
    }
  }
  // new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);

  checkObjecthasValue = (time) => {
    let res = false;
    Object.entries(time || {}).forEach(([key, value]) => {
      if (value) {
        res = true;
      }
    })
    return res;
  }

  @Input() time;
  timeExact;

  getTime = (time) => {
    if (this.isTuples) {
      const t = (time || []).filter(f => !!f);
      Object.keys(t[0] || {}).forEach(key => this.hourField = key);
      Object.keys(t[1] || {}).forEach(key => this.minField = key);

      if (t.length !== 0) {
        const date = new Date(0, 0, 0, t[0][this.hourField] || 8, t[1][this.minField] || 0);
        this.timeExact = date;
        this.timeChanged.setValue(date);
      }
    }
    else {
      const t = (time || []).filter(f => !!f);
      if (this.ishourValue) {
        Object.keys(t[0] || {}).forEach(key => this.hourField = key);
      }
      else {
        Object.keys(t[0] || {}).forEach(key => this.minField = key);
      }
      if (t.length !== 0) {
        if (this.ishourValue) {
          const date = new Date(0, 0, 0, t[0][this.hourField] || 8);
        this.timeExact = date;
        this.timeChanged.setValue(date);
        }
        else {
          const date = new Date(0, 0, 0,0,  t[0][this.minField] || 0);
          this.timeExact = date;

        this.timeChanged.setValue(date);
        }
      }
    }

  }

}
