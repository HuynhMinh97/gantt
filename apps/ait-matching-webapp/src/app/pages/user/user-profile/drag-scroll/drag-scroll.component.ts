import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService } from '@ait/ui';

@Component({
  selector: 'ait-drag-scroll',
  templateUrl: './drag-scroll.component.html',
  styleUrls: ['./drag-scroll.component.scss'],
})
export class DragScrollComponent implements OnChanges {
  @Input() list: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() width: string;
  errorList = '';
  constructor(private translateService: AitTranslationService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.errorList = this.translateService.translate('list empty');
  }
}
