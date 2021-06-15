import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService } from '../../services';
import { AitAppUtils } from '../../utils/ait-utils';

@Component({
  selector: 'ait-output-text',
  templateUrl: './ait-output-text.component.html',
  styleUrls: ['./ait-output-text.component.scss']
})
export class AitOutputTextComponent implements OnChanges {
  @Input() label = 'Default label';
  @Input() value = '';
  @Input() valueArray: string[] = [];
  @Input() placeholder = ''
  @Input() isTranslate = false;
  @Input() caption = ''
  @Input() iconCaption = 'info-outline';
  @Input() height;
  @Input() width;
  @Input() row = 1;
  constructor(private translateService: AitTranslationService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'valueArray') {
          const target = AitAppUtils.getArrayNotFalsy(this.valueArray);
          const comma = this.translateService.translate('s_0001');
          if (target.length !== 0) {
            this.value = target.join(comma || ',');
          }
          else {
            this.value = '';
          }

        }
      }
    }
  }

}
