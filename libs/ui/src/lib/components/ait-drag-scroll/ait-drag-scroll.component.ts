import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService} from '@ait/ui';

@Component({
  selector: 'ait-drag-scroll',
  styleUrls: ['./ait-drag-scroll.component.scss',],
  templateUrl : './ait-drag-scroll.component.html',
})
export class AitDragScrollComponent implements OnChanges {
  @Input() list: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() width: string;
  @Input() isNormal = false;
  errorList = '';
  constructor(private translateService: AitTranslationService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.errorList = this.translateService.translate('list empty');
  }
}
