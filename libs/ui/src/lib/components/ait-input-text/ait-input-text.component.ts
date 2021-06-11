import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ait-input-text',
  templateUrl: './ait-input-text.component.html',
  styleUrls: ['./ait-input-text.component.scss']
})
export class AitTextInputComponent implements OnChanges {
  @Input() status: NbComponentStatus = 'primary';
  @Input() fieldSize: NbComponentSize = 'medium';
  @Input() shape: NbComponentShape = 'rectangle';
  @Input() fullWidth: boolean;
  @Input() iconName = '';
  @Input() nbPrefix = true;
  @Output() watchValue = new EventEmitter();
  inputId = Date.now();
  @Input() value: string

  inputCtrl: FormControl;

  constructor() {
    this.inputCtrl = new FormControl('');
  }

  ngOnChanges(changes : SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'value') {
          this.inputCtrl.setValue(this.value);
        }

      }
    }
  }

  public reset() {
    console.log('reset')
    this.inputCtrl.reset();
  }

  onChange(value) {
    this.watchValue.emit(value);
  }
}
