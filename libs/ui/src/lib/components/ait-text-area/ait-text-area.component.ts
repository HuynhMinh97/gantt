// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { KEYS } from '@ait/shared';
import { EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ait-text-area',
  styleUrls: ['./ait-text-area.component.scss'],
  templateUrl: './ait-text-area.component.html'
})
export class AitTextAreaComponent implements OnInit, OnChanges {
  @Input() placeholder = '';
  @Input() defaultValue = null;
  @Input() formControlName = '';
  @Input() maxlength = 1;
  @Input() isJson = false;
  @Input() minHeight;
  @Input() disabled = false;
  @Input() width;
  @Input() row = 1;
  @Input() style = {};


  @Output() watchValue = new EventEmitter();


  @ViewChild('autoInput') input;
  inputControl: FormControl;
  result: any
  constructor() {
    this.inputControl = new FormControl('');

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        // console.log(JSON.parse(this.defaultValue))
        if (key === KEYS.DEFAULT_VALUE && this.defaultValue) {

          this.inputControl.patchValue(this.defaultValue);
        }

      }
    }
  }
  ngOnInit() {
    this.inputControl.valueChanges.subscribe(value => this.watchValue.emit(value))
    if (this.defaultValue) {
      this.inputControl.setValue(this.defaultValue);
    }
  }
}
