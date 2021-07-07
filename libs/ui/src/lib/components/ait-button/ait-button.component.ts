import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { title } from 'node:process';
import { AitTranslationService } from '../../services';
import { AppState, getCaption, getLang } from '../../state/selectors';

@Component({
  selector: 'ait-button',
  styleUrls: ['./ait-button.component.scss'],
  templateUrl: './ait-button.component.html',
})
export class AitButtonComponent implements OnChanges {
  constructor(private store: Store<AppState>, private translateService: AitTranslationService) {
    this.toolTip = this.title;
  }
  @Input() iconName;
  @Input() background = '';
  @Input() color = '';
  @Input() width = 'auto';
  @Input() border: string = null;
  @Input() height: string = null;
  @Input() margin: string = null;
  @Input() fontsize: string = null;
  @Input() uppercaseContent = false;
  @Input() isDisabled = false;
  @Input() isTranslate = true;
  @Input() classText = '';
  @Input() classBtn = '';
  @Input() styleBtn = {};
  @Input() styleIcon = {};
  @Input() styleText = {}
  @Input() id;

  @Input() title = '';
  @Input() toolTip = '';
  @Input() style = 'normal';

  ID(element: string): string {
    return this.id + '_' + element;
  }



  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'title') {

          this.store.pipe(select(getCaption)).subscribe((r) => {
            if (this.isTranslate) {
              //
              this.title = this.translateService.translate(this.title);


              this.toolTip = this.title;
            }
          })
        }

      }
    }
  }
}
