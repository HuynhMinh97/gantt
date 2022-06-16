import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AitTranslationService } from '../../services';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-chip',
  styleUrls: ['./ait-chip.component.scss'],
  templateUrl: 'ait-chip.component.html',
  styles: [
    `
      max-width: '100%';
    `,
  ],
})
export class AitChipComponent implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickChip = new EventEmitter();
  @Input() styles: any = {};
  @Input() title = 'default';
  @Input() isTooltip = false;
  @Input() isHaveIcon = true;
  @Input() isHaveBorder = false;
  @Input() icon = '';
  @Input() status = 'primary';
  @Output() action = new EventEmitter();
  @Input() isChipInCard = false;
  @Input() isAllowEdit = true;
  @Input() background = '#ffffff';
  @Input() colorText = '#10529D';
  @Input() is18n = true;
  @Input() id;
  @Input() level = 1;
  @Input() isEvaluate = false;
  @Output() watchValue = new EventEmitter();
  @Input() maxWidth = '100%';
  @Input() isSelected = false;
  STAR = [1, 2, 3, 4, 5];
  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return element + '_' + idx;
  }
  constructor(
    private translateService: AitTranslationService,
    private store: Store<AppState>
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'title') {
          if (this.is18n) {
            this.store.pipe(select(getCaption)).subscribe(() => {
              this.title = this.translateService.translate(this.title);
            });
          }
        }
      }
    }
  }

  iconAction = () => {
    this.action.emit({ isAction: true });
  };

  onClickChipEvent = () => {
    if (this.isHaveBorder) {
      this.onClickChip.emit({ isClickChip: true, isSelected: this.isSelected });
    } else {
      this.onClickChip.emit({ isClickChip: true });
    }
  };

  clickStar(val: number) {
    if (this.isAllowEdit) {
      this.level = val + 1;
      this.watchValue.emit(val + 1);
    }
  }

  getTitle(title: string) {
    if (!this.isHaveBorder || title.length < 12) {
      return title;
    } else {
      return title.substring(0, 7) + '...' + title.substring(title.length - 5);
    }
  }
}
