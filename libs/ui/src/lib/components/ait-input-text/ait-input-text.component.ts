import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';
import { AitTranslationService } from '../../services';

@Component({
  selector: 'ait-input-text',
  templateUrl: './ait-input-text.component.html',
  styleUrls: ['./ait-input-text.component.scss'],
  moduleId: 'ait-input-text'
})
export class AitTextInputComponent implements OnChanges {
  @Input() status: NbComponentStatus = null;
  @Input() fieldSize: NbComponentSize = 'medium';
  @Input() shape: NbComponentShape = 'rectangle';
  @Input() fullWidth: boolean;
  @Input() iconName = '';
  @Input() nbPrefix = true;
  @Output() watchValue = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onError = new EventEmitter();
  @Input() id = Date.now();
  @Input() defaultValue: string;
  @Input() isError = false;
  @Input() required = false;
  @Input() placeholder;
  @Input() styleMessage = {};
  @Input() label;
  @Input() guidance = ''
  @Input() guidanceIcon = '';
  @Input() rows = 1;
  @Input() cols;
  @Input() classContainer;
  @Input() length = null;
  @Input() isReset = false;
  @Input() styleLabel;
  @Input() width;
  @Input() height;
  @Input() isSubmit = false;
  @Input() readonly = false;
  @Input() errorMessages = [];
  @Input() clearError = false;
  componentErrors = []
  msgRequired = '';
  errorArray = [];
  value = '';

  inputCtrl: FormControl;

  getNameField = () => this.translateService.translate(this.label || '');

  getCaption = () => this.translateService.translate(this.guidance);


  constructor(private translateService: AitTranslationService) {
    this.inputCtrl = new FormControl('');
    this.msgRequired = this.translateService.getMsg('E0001').replace('{0}', this.getNameField());

  }
  ID(element: string): string {
    return this.id + '_' + element;
  }

  messagesError = () => Array.from(new Set([...this.componentErrors, ...this.errorMessages]))

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'defaultValue') {
          this.inputCtrl.setValue(this.defaultValue);
          this.watchValue.emit(this.defaultValue);

          if ((this.defaultValue || '').length !== 0 && this.length > 0) {
            this.checkMaxLength();
          }
          if (this.required) {
            this.onError.emit({ isValid: this.defaultValue && this.defaultValue.length !== 0 });
          }
        }
        if (key === 'errorMessages') {
          if (this.messagesError().length !== 0) {
            this.isError = true;
            this.onError.emit({ isValid: false });
          }
          else {
            if (this.required) {
              if (this.inputCtrl.value && (this.inputCtrl.value || '').length !== 0) {

              }
              else {
                this.onError.emit({ isValid: false });
              }
            } else {
              this.isError = false;
              this.onError.emit({ isValid: true });
            }



          }
        }
        if (key === 'isSubmit') {
          if (this.isSubmit) {
            this.onChange(this.inputCtrl.value);
          }
        }
        if (key === 'length') {
          if ((this.defaultValue || '').length !== 0 && this.length) {
            this.checkMaxLength();
          }
        }
        if (key === 'isReset') {

          if (this.isReset) {
            this.reset();
            this.isError = false;
            this.componentErrors = [];
            this.errorMessages = [];
            this.onError.emit({ isValid: null });
          }
        }

        if (key === 'clearError') {
          if (this.clearError) {
            this.isError = false;
            this.componentErrors = [];
            this.errorMessages = [];
          }
        }
      }
    }
  }

  checkMaxLength = (value?: string) => {
    const target = (value || '').length !== 0 ? value : this.defaultValue;

    const maxlengthMsg = this.translateService.getMsg('E0003').replace('{0}', this.getNameField()).replace('{1}', this.length)
    if (target.length > this.length) {
      this.onError.emit({ isValid: false });

      this.componentErrors = [...this.componentErrors, maxlengthMsg];
    }
    else {
      this.onError.emit({ isValid: true });
      this.componentErrors = [...this.componentErrors].filter(f => f !== maxlengthMsg);
    }
  }
  public reset() {
    this.inputCtrl.reset();
  }

  focusout = () => {
    this.checkReq(this.inputCtrl.value)
  }

  checkReq = (value) => {
    if (this.required) {
      if (!value) {
        const msg = this.translateService.getMsg('E0001').replace('{0}', this.getNameField());
        this.isError = true;
        this.componentErrors = [msg]

        this.onError.emit({ isValid: false });
      }
      else {
        this.componentErrors = [];
        if (this.messagesError().length === 0) {
          this.isError = false;
          this.onError.emit({ isValid: true });

        }

      }
    }
    else {
      // this.onError.emit({ isValid: true });
    }
  }

  getPlaceholder = () => this.translateService.translate(this.placeholder);

  onChange(value) {
    this.value = value;
    this.checkReq(value);
    this.checkMaxLength(value);
    this.watchValue.emit(value);

  }
}
