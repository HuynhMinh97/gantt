import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AitTranslationService } from '@ait/ui';

@Component({
  selector: 'ait-drag-scroll',
  templateUrl: './drag-scroll.component.html',
  styleUrls: ['./drag-scroll.component.scss'],
})
export class DragScrollComponent implements OnChanges {
  @Input() list: any[];
  @Input() showList: boolean[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() width: string;
  changeText = false;
  errorList = '';
  constructor(private translateService: AitTranslationService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.errorList = this.translateService.translate('list empty');
  }
  ngOnInit(): void {
    
    if (this.list.length > 0) {
      this.showList = new Array(this.list.length).fill(false);
      // this.list.forEach((item) => );
    }
    
  }
}
