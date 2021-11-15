import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AitTranslationService } from '../../services';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-chip',
  styleUrls: ['./ait-chip.component.scss'],
  templateUrl: 'ait-chip.component.html',
  styles: [
    `
    max-width : '100%'
    `
  ]
})
export class AitChipComponent implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickChip = new EventEmitter();
  @Input() styles: any = {};
  @Input() title = 'default';
  @Input() isTooltip = false;
  @Input() icon = '';
  @Input() status = 'primary'
  @Output() action = new EventEmitter();
  @Input() isChipInCard = false;
  @Input() background = '#ffffff';
  @Input() colorText = '#10529D';
  @Input() is18n = true;
  @Input() id;
  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return element + '_' + idx;
  }
  constructor(private translateService: AitTranslationService, private store: Store<AppState>) {

  }


  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'title') {
          if (this.is18n) {
            this.store.pipe(select(getCaption)).subscribe(() => {
              this.title = this.translateService.translate(this.title);
            })
          }
        }
      }
    }
  }

  iconAction = () => {
    this.action.emit({ isAction: true });
  }

  onClickChipEvent = () => this.onClickChip.emit({ isClickChip: true });
}
