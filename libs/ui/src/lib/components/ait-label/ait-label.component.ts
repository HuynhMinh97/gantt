import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService } from '../../services';

@Component({
  selector: 'ait-label',
  templateUrl: './ait-label.component.html',
  styleUrls: ['./ait-label.component.scss']
})
export class AitLabelComponent implements OnChanges  {
  @Input() label: string;
  @Input() isTranslate = true;
  @Input() styleText = {};

  constructor(private translateService : AitTranslationService) {

  }

  getLabelTranslate = () => {
    return this.translateService.translate(this.label);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'label') {
          if (this.isTranslate) {

          }
        }

      }
    }
  }

}
