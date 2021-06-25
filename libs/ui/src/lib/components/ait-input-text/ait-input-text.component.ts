import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';
import { AitTranslationService } from '../../services';

@Component({
  selector: 'ait-input-text',
  templateUrl: './ait-input-text.component.html',
  styleUrls: ['./ait-input-text.component.scss']
})
export class AitTextInputComponent implements OnChanges {
  @Input() status: NbComponentStatus = null;
  @Input() fieldSize: NbComponentSize = 'medium';
  @Input() shape: NbComponentShape = 'rectangle';
  @Input() fullWidth: boolean;
  @Input() iconName = '';
  @Input() nbPrefix = true;
  @Output() watchValue = new EventEmitter();
  inputId = Date.now();
  @Input() defaultValue: string;
  @Input() isError = false;
  @Input() required = false;
  @Input() placeholder;
  @Input() styleMessage = {};
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = 'info-outline';
  @Input() rows = 1;
  @Input() cols;
  @Input() classContainer;
  @Input() length = 255;
  errors = []

  inputCtrl: FormControl;

  getNameField = () => this.translateService.translate(this.label || '');

  getCaption = () => this.translateService.translate(this.guidance);


  constructor(private translateService: AitTranslationService) {
    this.inputCtrl = new FormControl('');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'defaultValue') {
          this.inputCtrl.setValue(this.defaultValue);
          this.watchValue.emit(this.defaultValue);
        }

      }
    }
  }

  public reset() {
    console.log('reset')
    this.inputCtrl.reset();
  }

  onChange(value) {
    if (this.required) {
      if (!value) {
        const msg = this.translateService.getMsg('E0001').replace('{0}', this.getNameField());;
        this.isError = true;
        this.errors = [msg]
      }
      else {
        this.isError = false;
        this.errors = []
      }
    }
    this.watchValue.emit(value);
  }
}
