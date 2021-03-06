/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AitEnvironmentService, AitTranslationService } from '../../services';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-card-content',
  templateUrl: './ait-card-content.component.html',
  styleUrls: ['./ait-card-content.component.scss'],
})
export class AitCardContentComponent  implements OnChanges {
  constructor(
    private envService: AitEnvironmentService,
    private store: Store<AppState>,
    private translate: AitTranslationService,
  ) {
    store.pipe(select(getCaption)).subscribe(() => {
      this.buttonTitle = translate.translate(this.buttonTitle || '追加する');
    });
  }
  @Input() label = 'Default';
  @Input() loading = false;
  @Output() onClickButtonHeader = new EventEmitter();
  @Output() onToggle = new EventEmitter();
  @Input() isColumn = false;
  @Input() isStart = false;
  @Input() transition = true;
  @Input() padding = '';
  @Input() tooltip = '';
  @Input() actionBtn = [];
  @Input() displayBlock=false;
  @Input() widthBtn = 'auto';
  @Input() disableHeader = false;
  gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';
  isShow = true;
  @Input()
  isOpen = true;
  isDev = false;
  @Input()
  disableButton = false;
  @Input() buttonTitle = '';
  @Input() classContainer: any;
  @Input() id;

  @Input() summary = '';
  @Input() styleSummary = {};
  @Input() styleLabel = {};
  @Input() styleDivider = {};
  @Input() styleContent = {};

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  get textButton(): string {
    return '追加する';
  }

  get LABEL(): string {
    return this.translate.translate(this.label);
  }

  toggleExpan = (isClick = false) => {
    if (!isClick) {
      this.isOpen = !this.isOpen;
      this.onToggle.emit(this.isOpen);
    }
  };

  handleClickBtnHeader = () => {
    !this.tooltip && this.onClickButtonHeader.emit({ clicked: true });
  };

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'buttonTitle') {
          this.store.pipe(select(getCaption)).subscribe((r) => {
              this.buttonTitle = this.translate.translate(this.buttonTitle);           
          })
        }

      }
    }
  }

}
