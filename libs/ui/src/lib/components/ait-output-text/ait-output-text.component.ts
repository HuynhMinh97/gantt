import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService } from '../../services';
import { AitAppUtils } from '../../utils/ait-utils';

@Component({
  selector: 'ait-output-text',
  templateUrl: './ait-output-text.component.html',
  styleUrls: ['./ait-output-text.component.scss']
})
export class AitOutputTextComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '';
  @Input() valueArray: string[] = [];
  @Input() guidance = ''
  @Input() guidanceIcon = 'info-outline';
  @Input() height;
  @Input() width;
  @Input() rows = 1;
  @Input() classContainer;
  @Input() id;
  @Input() tabIndex;
  constructor(private translateService: AitTranslationService) {

  }

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }


  getCaption = () => this.translateService.translate(this.guidance);
  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        if (key === 'valueArray') {
          const target = Array.from(new Set(AitAppUtils.getArrayNotFalsy(this.valueArray)));
          const comma = this.translateService.translate('s_0001');
          if (target.length !== 0) {
            const m = comma !== 's_0001' ? comma : ','
            this.value = target.join(m);
          }
          else {
            this.value = '';
          }

        }
      }
    }
  }

}
